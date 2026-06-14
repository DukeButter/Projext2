const { app, BrowserWindow, ipcMain, Menu, nativeImage, Notification, Tray } = require('electron');
const fs = require('fs');
const path = require('path');

const APP_NAME = '我真的不爱喝水';
const APP_ID = 'com.wozhendebuai.heshui';
const ICON_PATH = path.join(__dirname, 'assets', 'icon.png');
const DEVELOPER_MODE_MARKER_PATH = path.join(__dirname, '.developer-mode');
const LEGACY_DATA_DIR_NAMES = [
  'wo-zhen-de-bu-ai-heshui',
  '我就不喜欢喝水',
  'wo-jiu-bu-xihuan-heshui',
  'bao-water-reminder',
  '宝の喝水提醒',
  '瀹濄伄鍠濇按鎻愰啋',
  'Electron'
];

function isDeveloperModeEnabled() {
  return process.env.WOZHENDE_WATER_DEVELOPER_MODE === '1' || fs.existsSync(DEVELOPER_MODE_MARKER_PATH);
}

const initialDeveloperMode = isDeveloperModeEnabled();

const defaultState = {
  date: todayKey(),
  cups: 0,
  goal: 8,
  // Sacred water tokens: earned from daily hydration completion and spent on blessings.
  totalCoins: 0,
  // Sacred water coins: earned from blessing rewards and saved for future shops.
  blessingCoins: 0,
  rareSkinFragments: 0,
  lastCoinAwardDate: null,
  lastBlessingDrawDate: null,
  blessingHistory: [],
  intervalMinutes: 60,
  customIntervalMinutes: 45,
  paused: false,
  launchAtStartup: false,
  customReminders: [],
  ownedSkins: ['sacred'],
  activeSkin: 'sacred',
  developerMode: initialDeveloperMode
};

const skinCatalog = [
  { id: 'origin', name: '原初', price: 200 },
  { id: 'hell', name: '恶魔地狱', price: 500 }
];

const blessingRewards = [
  { id: 'water_coin_5', label: '5 圣水金币', type: 'blessingCoins', amount: 5, chance: 50 },
  { id: 'water_coin_10', label: '10 圣水金币', type: 'blessingCoins', amount: 10, chance: 30 },
  { id: 'water_coin_20', label: '20 圣水金币', type: 'blessingCoins', amount: 20, chance: 15 },
  { id: 'water_coin_50', label: '50 圣水金币', type: 'blessingCoins', amount: 50, chance: 4 },
  { id: 'rare_skin_fragment', label: '稀有外观碎片', type: 'rareSkinFragments', amount: 1, chance: 1 }
];

const reminderMessages = [
  '今天也要做喝水大王！！！',
  '水牛提醒您：该喝水了哞',
  '让你喝水你就喝水，犟嘴呢怎么（bushi',
  '喝水啦喝水啦 水喝多了才有尿',
  '哦 my love~ 喝点水~哦耶~',
  'Only You~~~ 多喝一点水~',
  '水时已到（瞄准--',
  '新事件已触发：饮水',
  '滴滴 - 检测到羚羊缺水'
];

const rareReminderMessage = '恭喜你运气爆棚触发超稀有补水奖励！！！！！！凭此截图可向开发者领取奖励~~~';

let mainWindow;
let tray;
let reminderTimer;
const customReminderTimers = new Map();
let state = { ...defaultState };
let dataFilePath;
let isQuitting = false;

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getReminderMessage() {
  return Math.random() < 0.02 ? rareReminderMessage : randomItem(reminderMessages);
}

function getReminderDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getReminderOccurrenceKey(reminder, date = new Date()) {
  if (reminder.mode === 'interval') {
    return `${reminder.id}:${date.toISOString()}`;
  }

  return `${reminder.id}:${getReminderDayKey(date)}:${reminder.time}`;
}

function isValidReminderTime(time) {
  return typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

function normalizeFrequency(frequency) {
  return ['daily', 'weekdays', 'weekends'].includes(frequency) ? frequency : 'daily';
}

function normalizeReminderMode(mode) {
  return mode === 'interval' ? 'interval' : 'fixed';
}

function normalizeReminderInterval(intervalMinutes) {
  const interval = Math.round(Number(intervalMinutes) || 60);
  return [60, 90, 120, 180].includes(interval) ? interval : 60;
}

function normalizeCustomReminder(reminder = {}) {
  const id = typeof reminder.id === 'string' && reminder.id.trim()
    ? reminder.id
    : `reminder-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const title = typeof reminder.title === 'string' && reminder.title.trim()
    ? reminder.title.trim().slice(0, 40)
    : '新的提醒事项';
  const time = isValidReminderTime(reminder.time) ? reminder.time : '09:00';

  return {
    id,
    title,
    mode: normalizeReminderMode(reminder.mode),
    time,
    intervalMinutes: normalizeReminderInterval(reminder.intervalMinutes),
    frequency: normalizeFrequency(reminder.frequency),
    enabled: typeof reminder.enabled === 'boolean' ? reminder.enabled : true,
    lastTriggeredKey: typeof reminder.lastTriggeredKey === 'string' ? reminder.lastTriggeredKey : null,
    lastIntervalTriggeredAt: typeof reminder.lastIntervalTriggeredAt === 'string' ? reminder.lastIntervalTriggeredAt : null,
    createdAt: typeof reminder.createdAt === 'string' ? reminder.createdAt : new Date().toISOString(),
    updatedAt: typeof reminder.updatedAt === 'string' ? reminder.updatedAt : new Date().toISOString()
  };
}

function ensureTodayState() {
  state.developerMode = typeof state.developerMode === 'boolean' ? state.developerMode : initialDeveloperMode;
  state.totalCoins = Math.max(0, Math.round(Number(state.totalCoins) || 0));
  state.blessingCoins = Math.max(0, Math.round(Number(state.blessingCoins) || 0));
  state.ownedSkins = Array.isArray(state.ownedSkins) && state.ownedSkins.length > 0 ? state.ownedSkins : ['sacred'];
  if (!state.ownedSkins.includes('sacred')) {
    state.ownedSkins.unshift('sacred');
  }
  state.activeSkin = state.ownedSkins.includes(state.activeSkin) ? state.activeSkin : 'sacred';
  state.customReminders = Array.isArray(state.customReminders)
    ? state.customReminders.map(normalizeCustomReminder)
    : [];

  const currentDate = todayKey();

  if (state.date !== currentDate) {
    state.date = currentDate;
    state.cups = 0;
    saveState();
  }
}

function readState() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const savedState = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      state = { ...defaultState, ...savedState };
    }
  } catch (error) {
    console.error('Failed to read saved data:', error);
    state = { ...defaultState };
  }

  ensureTodayState();
}

function getLaunchAtStartupTarget() {
  if (process.defaultApp) {
    return null;
  }

  const options = {
    path: process.execPath
  };

  return options;
}

function getDevelopmentLaunchAtStartupTarget() {
  return {
    path: process.execPath,
    args: [app.getAppPath()]
  };
}

function clearDevelopmentLaunchAtStartup() {
  app.setLoginItemSettings({
    ...getDevelopmentLaunchAtStartupTarget(),
    openAtLogin: false
  });
}

function syncLaunchAtStartupState() {
  const launchTarget = getLaunchAtStartupTarget();
  if (!launchTarget) {
    clearDevelopmentLaunchAtStartup();
    state.launchAtStartup = false;
    return;
  }

  state.launchAtStartup = launchTarget ? app.getLoginItemSettings(launchTarget).openAtLogin : false;
}

function saveState() {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify(state, null, 2), 'utf-8');
}

function readStateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error('Failed to read state file:', filePath, error);
    return null;
  }
}

function getLegacyDataFilePaths() {
  return LEGACY_DATA_DIR_NAMES
    .map((name) => path.join(app.getPath('appData'), name, 'water-data.json'))
    .filter((filePath) => path.resolve(filePath) !== path.resolve(dataFilePath));
}

function mergeStateData(currentState, legacyState) {
  const merged = { ...defaultState, ...(legacyState || {}), ...(currentState || {}) };
  const currentDate = (currentState && currentState.date) || merged.date;

  if (legacyState && legacyState.date === currentDate) {
    merged.cups = Math.max(currentState && Number.isFinite(currentState.cups) ? currentState.cups : 0, legacyState.cups || 0);
  }

  merged.totalCoins = Math.max(currentState && currentState.totalCoins ? currentState.totalCoins : 0, legacyState && legacyState.totalCoins ? legacyState.totalCoins : 0);
  merged.blessingCoins = Math.max(currentState && currentState.blessingCoins ? currentState.blessingCoins : 0, legacyState && legacyState.blessingCoins ? legacyState.blessingCoins : 0);
  merged.rareSkinFragments = Math.max(currentState && currentState.rareSkinFragments ? currentState.rareSkinFragments : 0, legacyState && legacyState.rareSkinFragments ? legacyState.rareSkinFragments : 0);
  merged.ownedSkins = [...new Set([...(legacyState && Array.isArray(legacyState.ownedSkins) ? legacyState.ownedSkins : []), ...(currentState && Array.isArray(currentState.ownedSkins) ? currentState.ownedSkins : []), 'sacred'])];
  merged.activeSkin = merged.ownedSkins.includes(merged.activeSkin) ? merged.activeSkin : 'sacred';
  merged.blessingHistory = [...(currentState && Array.isArray(currentState.blessingHistory) ? currentState.blessingHistory : []), ...(legacyState && Array.isArray(legacyState.blessingHistory) ? legacyState.blessingHistory : [])].slice(0, 30);

  return merged;
}

function migrateLegacyDataIfNeeded() {
  let migratedState = readStateFile(dataFilePath) || null;

  for (const legacyDataPath of getLegacyDataFilePaths()) {
    const legacyState = readStateFile(legacyDataPath);
    if (!legacyState) continue;

    migratedState = mergeStateData(migratedState, legacyState);
  }

  if (!migratedState) return;

  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify(migratedState, null, 2), 'utf-8');
}

function isGoalComplete() {
  return state.cups >= state.goal;
}

function awardDailyTokensIfGoalComplete() {
  const currentDate = todayKey();
  const isComplete = isGoalComplete();
  const alreadyAwardedToday = state.lastCoinAwardDate === currentDate;

  if (!isComplete || alreadyAwardedToday) {
    return false;
  }

  state.totalCoins += 3;
  state.lastCoinAwardDate = currentDate;
  return true;
}

function pickBlessingReward() {
  const roll = Math.random() * 100;
  let cursor = 0;

  for (const reward of blessingRewards) {
    cursor += reward.chance;
    if (roll < cursor) {
      return reward;
    }
  }

  return blessingRewards[0];
}

function drawDailyBlessing() {
  ensureTodayState();

  if (!state.developerMode && state.totalCoins < 1) {
    return { ok: false, reason: 'token-insufficient', state };
  }

  if (!state.developerMode) {
    state.totalCoins -= 1;
  }

  const reward = pickBlessingReward();
  const result = {
    id: reward.id,
    label: reward.label,
    type: reward.type,
    amount: reward.amount,
    date: todayKey(),
    awardedAt: new Date().toISOString()
  };

  if (reward.type === 'blessingCoins') {
    state.blessingCoins += reward.amount;
  }

  if (reward.type === 'rareSkinFragments') {
    state.rareSkinFragments += reward.amount;
  }

  if (!state.developerMode) {
    state.lastBlessingDrawDate = todayKey();
  }
  state.lastBlessingReward = result;
  state.blessingHistory = [result, ...(state.blessingHistory || [])].slice(0, 30);
  saveState();
  sendStateToRenderer();

  return { ok: true, reward: result, state };
}

function getSkinById(skinId) {
  return skinCatalog.find((skin) => skin.id === skinId);
}

function buySkin(skinId) {
  ensureTodayState();

  const skin = getSkinById(skinId);
  if (!skin) {
    return { ok: false, reason: 'skin-not-found', state };
  }

  if (state.ownedSkins.includes(skin.id)) {
    state.activeSkin = skin.id;
    saveState();
    sendStateToRenderer();
    return { ok: true, reason: 'already-owned', state };
  }

  if ((state.blessingCoins || 0) < skin.price) {
    return { ok: false, reason: 'coin-insufficient', state };
  }

  state.blessingCoins -= skin.price;
  state.ownedSkins.push(skin.id);
  state.activeSkin = skin.id;
  saveState();
  sendStateToRenderer();

  return { ok: true, state };
}

function equipSkin(skinId) {
  ensureTodayState();

  if (!state.ownedSkins.includes(skinId)) {
    return { ok: false, reason: 'skin-not-owned', state };
  }

  state.activeSkin = skinId;
  saveState();
  sendStateToRenderer();

  return { ok: true, state };
}

function toggleDeveloperMode() {
  ensureTodayState();
  state.developerMode = !state.developerMode;
  saveState();
  sendStateToRenderer();

  return { ok: true, developerMode: state.developerMode, state };
}

function updateDeveloperCurrency(currency) {
  ensureTodayState();

  if (!state.developerMode) {
    return { ok: false, reason: 'developer-mode-required', state };
  }

  if (typeof currency.totalCoins === 'number') {
    state.totalCoins = Math.max(0, Math.min(999999, Math.round(currency.totalCoins)));
  }

  if (typeof currency.blessingCoins === 'number') {
    state.blessingCoins = Math.max(0, Math.min(999999, Math.round(currency.blessingCoins)));
  }

  saveState();
  sendStateToRenderer();

  return { ok: true, state };
}

function createFallbackIcon() {
  const iconSvg = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="14" fill="#15142b"/>
      <path d="M32 10C22 22 17 30 17 39c0 9 6.8 15 15 15s15-6 15-15c0-9-5-17-15-29Z" fill="#71e7ff"/>
      <path d="M25 39c2 5 6 7 12 6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <path d="M43 14l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z" fill="#ff8fd8"/>
    </svg>
  `;

  return nativeImage.createFromDataURL(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`);
}

function createAppIcon() {
  const icon = nativeImage.createFromPath(ICON_PATH);

  // If the custom icon cannot be read, use a small built-in fallback.
  return icon.isEmpty() ? createFallbackIcon() : icon;
}

function createWindowIcon() {
  return createAppIcon().resize({ width: 64, height: 64 });
}

function createTrayIcon() {
  return createAppIcon().resize({ width: 32, height: 32 });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 430,
    height: 650,
    minWidth: 360,
    minHeight: 560,
    title: APP_NAME,
    icon: createWindowIcon(),
    backgroundColor: '#15142b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      showNotification('我会在托盘里陪着你', '需要的时候点托盘图标就能回来。');
    }
  });
}

function sendStateToRenderer() {
  ensureTodayState();

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('state-changed', state);
  }
}

function showNotification(title, body) {
  if (!Notification.isSupported()) return;

  new Notification({
    title,
    body,
    silent: false
  }).show();
}

function doesFrequencyMatchDate(frequency, date) {
  const day = date.getDay();

  if (frequency === 'weekdays') return day >= 1 && day <= 5;
  if (frequency === 'weekends') return day === 0 || day === 6;

  return true;
}

function getNextCustomReminderDate(reminder, fromDate = new Date()) {
  if (reminder.mode === 'interval') {
    return getNextIntervalReminderDate(reminder, fromDate);
  }

  const [hour, minute] = reminder.time.split(':').map(Number);

  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = new Date(fromDate);
    candidate.setDate(candidate.getDate() + offset);
    candidate.setHours(hour, minute, 0, 0);

    if (candidate <= fromDate) continue;
    if (!doesFrequencyMatchDate(reminder.frequency, candidate)) continue;

    return candidate;
  }

  return null;
}

function getNextIntervalReminderDate(reminder, fromDate = new Date()) {
  const intervalMs = normalizeReminderInterval(reminder.intervalMinutes) * 60 * 1000;
  const lastTriggeredAt = reminder.lastIntervalTriggeredAt ? new Date(reminder.lastIntervalTriggeredAt) : null;
  let candidate = lastTriggeredAt && !Number.isNaN(lastTriggeredAt.getTime())
    ? new Date(lastTriggeredAt.getTime() + intervalMs)
    : new Date(fromDate.getTime() + intervalMs);

  if (candidate <= fromDate) {
    candidate = new Date(fromDate.getTime() + intervalMs);
  }

  for (let offset = 0; offset < 8; offset += 1) {
    const dayCandidate = new Date(candidate);
    dayCandidate.setDate(candidate.getDate() + offset);

    if (!doesFrequencyMatchDate(reminder.frequency, dayCandidate)) continue;
    if (offset > 0) {
      dayCandidate.setHours(0, 0, 0, 0);
      dayCandidate.setTime(dayCandidate.getTime() + intervalMs);
    }

    return dayCandidate;
  }

  return null;
}

function clearCustomReminderTimers() {
  customReminderTimers.forEach((timer) => clearTimeout(timer));
  customReminderTimers.clear();
}

function getFrequencyLabel(frequency) {
  if (frequency === 'weekdays') return '工作日';
  if (frequency === 'weekends') return '周末';

  return '每天';
}

function getReminderScheduleLabel(reminder) {
  if (reminder.mode === 'interval') {
    const hours = normalizeReminderInterval(reminder.intervalMinutes) / 60;
    return `每 ${Number.isInteger(hours) ? hours : hours.toFixed(1)} 小时`;
  }

  return reminder.time;
}

function scheduleCustomReminders() {
  clearCustomReminderTimers();

  for (const reminder of state.customReminders || []) {
    if (!reminder.enabled || !isValidReminderTime(reminder.time)) continue;

    const nextDate = getNextCustomReminderDate(reminder);
    if (!nextDate) continue;

    const delay = Math.max(1000, nextDate.getTime() - Date.now());
    const timer = setTimeout(() => {
      ensureTodayState();

      const latestReminder = state.customReminders.find((item) => item.id === reminder.id);
      if (!latestReminder || !latestReminder.enabled) {
        scheduleCustomReminders();
        return;
      }

      const occurrenceKey = getReminderOccurrenceKey(latestReminder, nextDate);
      if (latestReminder.lastTriggeredKey !== occurrenceKey) {
        latestReminder.lastTriggeredKey = occurrenceKey;
        if (latestReminder.mode === 'interval') {
          latestReminder.lastIntervalTriggeredAt = new Date().toISOString();
        }
        showNotification(latestReminder.title, `${getFrequencyLabel(latestReminder.frequency)} ${getReminderScheduleLabel(latestReminder)}`);
        saveState();
        sendStateToRenderer();
      }

      scheduleCustomReminders();
    }, delay);

    customReminderTimers.set(reminder.id, timer);
  }
}

function saveCustomReminder(reminder) {
  ensureTodayState();

  const normalizedReminder = normalizeCustomReminder(reminder);
  normalizedReminder.updatedAt = new Date().toISOString();
  const existingIndex = state.customReminders.findIndex((item) => item.id === normalizedReminder.id);

  if (existingIndex >= 0) {
    state.customReminders[existingIndex] = {
      ...state.customReminders[existingIndex],
      ...normalizedReminder,
      createdAt: state.customReminders[existingIndex].createdAt
    };
  } else {
    state.customReminders = [normalizedReminder, ...state.customReminders].slice(0, 12);
  }

  saveState();
  scheduleCustomReminders();
  sendStateToRenderer();

  return state;
}

function deleteCustomReminder(reminderId) {
  ensureTodayState();
  state.customReminders = state.customReminders.filter((reminder) => reminder.id !== reminderId);
  saveState();
  scheduleCustomReminders();
  sendStateToRenderer();

  return state;
}

function scheduleReminder() {
  if (reminderTimer) {
    clearInterval(reminderTimer);
    reminderTimer = null;
  }

  if (state.paused) return;

  const delay = state.intervalMinutes * 60 * 1000;
  reminderTimer = setInterval(() => {
    ensureTodayState();
    showNotification(APP_NAME, getReminderMessage());
  }, delay);
}

function buildTrayMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: '打开主窗口',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: state.paused ? '恢复提醒' : '暂停提醒',
      click: () => {
        state.paused = !state.paused;
        saveState();
        scheduleReminder();
        buildTrayMenu();
        sendStateToRenderer();
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);
}

function createTray() {
  tray = new Tray(createTrayIcon());
  tray.setToolTip(APP_NAME);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  buildTrayMenu();
}

function setLaunchAtStartup(enabled) {
  const launchTarget = getLaunchAtStartupTarget();
  if (!launchTarget) {
    clearDevelopmentLaunchAtStartup();
    state.launchAtStartup = false;
    showNotification('开机召唤需要安装版', '当前是 Electron 开发模式，注册后会显示 Electron 标志；请用打包后的应用开启。');
    return;
  }

  state.launchAtStartup = enabled;
  app.setLoginItemSettings({
    ...launchTarget,
    openAtLogin: enabled
  });
  syncLaunchAtStartupState();
}

app.whenReady().then(() => {
  app.setName(APP_NAME);
  app.setAppUserModelId(APP_ID);
  app.setPath('userData', path.join(app.getPath('appData'), APP_NAME));
  Menu.setApplicationMenu(null);
  dataFilePath = path.join(app.getPath('userData'), 'water-data.json');
  migrateLegacyDataIfNeeded();
  readState();
  syncLaunchAtStartupState();

  createMainWindow();
  createTray();
  scheduleReminder();
  scheduleCustomReminders();

  ipcMain.handle('get-state', () => {
    ensureTodayState();
    return state;
  });

  ipcMain.handle('drink-water', () => {
    ensureTodayState();
    state.cups += 1;
    awardDailyTokensIfGoalComplete();
    saveState();
    sendStateToRenderer();
    return state;
  });

  ipcMain.handle('draw-blessing', () => drawDailyBlessing());

  ipcMain.handle('buy-skin', (_, skinId) => buySkin(skinId));

  ipcMain.handle('equip-skin', (_, skinId) => equipSkin(skinId));

  ipcMain.handle('toggle-developer-mode', () => toggleDeveloperMode());

  ipcMain.handle('update-developer-currency', (_, currency) => updateDeveloperCurrency(currency));

  ipcMain.handle('save-custom-reminder', (_, reminder) => saveCustomReminder(reminder));

  ipcMain.handle('delete-custom-reminder', (_, reminderId) => deleteCustomReminder(reminderId));

  ipcMain.handle('undo-water', () => {
    ensureTodayState();
    state.cups = Math.max(0, state.cups - 1);
    saveState();
    sendStateToRenderer();
    return state;
  });

  ipcMain.handle('update-settings', (_, settings) => {
    ensureTodayState();

    if (typeof settings.goal === 'number') {
      state.goal = Math.max(1, Math.min(30, Math.round(settings.goal)));
    }

    if (typeof settings.intervalMinutes === 'number') {
      state.intervalMinutes = Math.max(1, Math.min(1440, Math.round(settings.intervalMinutes)));
    }

    if (typeof settings.customIntervalMinutes === 'number') {
      state.customIntervalMinutes = Math.max(1, Math.min(1440, Math.round(settings.customIntervalMinutes)));
    }

    if (typeof settings.paused === 'boolean') {
      state.paused = settings.paused;
    }

    if (typeof settings.launchAtStartup === 'boolean') {
      setLaunchAtStartup(settings.launchAtStartup);
    }

    saveState();
    scheduleReminder();
    scheduleCustomReminders();
    buildTrayMenu();
    sendStateToRenderer();
    return state;
  });

  ipcMain.handle('show-window', () => {
    mainWindow.show();
    mainWindow.focus();
  });
});

// Keep the app alive in the tray even when the window is hidden.
app.on('window-all-closed', () => {});

app.on('before-quit', () => {
  isQuitting = true;
});

