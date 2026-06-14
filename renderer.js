const encouragementMessages = [
  '水分 +1，圣光也 +1。',
  '宝完成了一次小小补水仪式。',
  '生命之水已收入背包，状态恢复中。',
  '圣杯轻轻发光，今天也在好好照顾自己。',
  '补给成功，心情和水分都亮了一格。',
  '今日圣水记录更新，宝很棒。'
];

const completeMessages = [
  '宝完成了今日补水仪式。',
  '圣水已满，今天的宝被好好照顾到了。',
  '生命之水收集完成，圣光也为你亮起来了。'
];

const coinMessages = [
  '今日目标完成，圣水代币 +3。',
  '圣水补给达标，3 枚圣水代币收入小金库。',
  '今日仪式圆满，获得 3 枚发光圣水代币。'
];

const cupsCount = document.querySelector('#cupsCount');
const goalCount = document.querySelector('#goalCount');
const coinCount = document.querySelector('#coinCount');
const blessingCoinCount = document.querySelector('#blessingCoinCount');
const cupWater = document.querySelector('#cupWater');
const drinkButton = document.querySelector('#drinkButton');
const undoButton = document.querySelector('#undoButton');
const encouragement = document.querySelector('#encouragement');
const goalInput = document.querySelector('#goalInput');
const pausedInput = document.querySelector('#pausedInput');
const startupInput = document.querySelector('#startupInput');
const progressFill = document.querySelector('#progressFill');
const progressSegments = document.querySelector('#progressSegments');
const intervalButtons = [...document.querySelectorAll('[data-minutes]')];
const customIntervalOption = document.querySelector('#customIntervalOption');
const customIntervalRow = document.querySelector('#customIntervalRow');
const customIntervalInput = document.querySelector('#customIntervalInput');
const customIntervalButton = document.querySelector('#customIntervalButton');
const blessingButton = document.querySelector('#blessingButton');
const blessingStatus = document.querySelector('#blessingStatus');
const blessingResult = document.querySelector('#blessingResult');
const blessingOverlay = document.querySelector('#blessingOverlay');
const developerBadge = document.querySelector('#developerBadge');
const developerTools = document.querySelector('#developerTools');
const developerTokenInput = document.querySelector('#developerTokenInput');
const developerCoinInput = document.querySelector('#developerCoinInput');
const developerSaveButton = document.querySelector('#developerSaveButton');
const developerToolsStatus = document.querySelector('#developerToolsStatus');
const rewardSlot = document.querySelector('#rewardSlot');
const slotRewardIcon = document.querySelector('#slotRewardIcon');
const slotRewardName = document.querySelector('#slotRewardName');
const slotRewardValue = document.querySelector('#slotRewardValue');
const rewardCard = document.querySelector('#rewardCard');
const rewardIcon = document.querySelector('#rewardIcon');
const rewardTitle = document.querySelector('#rewardTitle');
const rewardSubtitle = document.querySelector('#rewardSubtitle');
const shopEntryButton = document.querySelector('#shopEntryButton');
const shopPanel = document.querySelector('#shopPanel');
const shopBackButton = document.querySelector('#shopBackButton');
const shopCoinCount = document.querySelector('#shopCoinCount');
const shopStatus = document.querySelector('#shopStatus');
const equipSacredButton = document.querySelector('#equipSacredButton');
const originSkinButton = document.querySelector('#originSkinButton');
const hellSkinButton = document.querySelector('#hellSkinButton');
const remindersEntryButton = document.querySelector('#remindersEntryButton');
const remindersPanel = document.querySelector('#remindersPanel');
const remindersBackButton = document.querySelector('#remindersBackButton');
const remindersSummary = document.querySelector('#remindersSummary');
const remindersList = document.querySelector('#remindersList');
const remindersStatus = document.querySelector('#remindersStatus');
const reminderTitleInput = document.querySelector('#reminderTitleInput');
const reminderTimeInput = document.querySelector('#reminderTimeInput');
const reminderTimeField = document.querySelector('#reminderTimeField');
const reminderIntervalField = document.querySelector('#reminderIntervalField');
const reminderIntervalInput = document.querySelector('#reminderIntervalInput');
const reminderModeButtons = [...document.querySelectorAll('[data-reminder-mode]')];
const reminderFrequencyInput = document.querySelector('#reminderFrequencyInput');
const reminderEnabledInput = document.querySelector('#reminderEnabledInput');
const reminderResetButton = document.querySelector('#reminderResetButton');
const reminderSaveButton = document.querySelector('#reminderSaveButton');

const homeViewElements = [
  document.querySelector('.hero'),
  document.querySelector('.progress-panel'),
  document.querySelector('.blessing-panel'),
  document.querySelector('.settings-panel'),
  remindersEntryButton,
  shopEntryButton
];

const blessingRollItems = [
  { label: '5 圣水金币', value: '+5', rarity: 'common', icon: 'gold-small' },
  { label: '10 圣水金币', value: '+10', rarity: 'common', icon: 'gold-small' },
  { label: '20 圣水金币', value: '+20', rarity: 'rare', icon: 'gold-large' },
  { label: '50 圣水金币', value: '+50', rarity: 'epic', icon: 'chest-open' },
  { label: '稀有外观碎片', value: '+1', rarity: 'legendary', icon: 'fragment' },
  { label: '蓝宝石圣物', value: '???', rarity: 'legendary', icon: 'sapphire' },
  { label: '钻石圣物', value: '???', rarity: 'legendary', icon: 'diamond' },
  { label: '封印宝箱', value: '???', rarity: 'epic', icon: 'chest-closed' },
  { label: '大量圣水金币', value: '+50', rarity: 'epic', icon: 'chest-open' },
  { label: '一堆圣水金币', value: '+20', rarity: 'rare', icon: 'gold-large' }
];

const segmentPalette = [
  { base: '#49c9f3', deep: '#268abd', glow: 'rgba(73, 201, 243, 0.5)' },
  { base: '#7be4ff', deep: '#36a9cf', glow: 'rgba(123, 228, 255, 0.52)' },
  { base: '#a9f1ff', deep: '#63c5da', glow: 'rgba(169, 241, 255, 0.55)' },
  { base: '#b8f6df', deep: '#69cba7', glow: 'rgba(184, 246, 223, 0.48)' },
  { base: '#d9f6a8', deep: '#9ecf62', glow: 'rgba(217, 246, 168, 0.5)' },
  { base: '#fff2a8', deep: '#d6b95c', glow: 'rgba(255, 242, 168, 0.58)' },
  { base: '#ffd86f', deep: '#d79b36', glow: 'rgba(255, 216, 111, 0.66)' },
  { base: '#ffbd45', deep: '#c87b22', glow: 'rgba(255, 189, 69, 0.72)' }
];

const hellSegmentPalette = [
  { base: '#7a0b05', deep: '#2a0203', glow: 'rgba(255, 64, 21, 0.28)' },
  { base: '#a61607', deep: '#3a0203', glow: 'rgba(255, 64, 21, 0.34)' },
  { base: '#d52b0e', deep: '#610704', glow: 'rgba(255, 64, 21, 0.42)' },
  { base: '#f04d16', deep: '#7f1205', glow: 'rgba(255, 91, 26, 0.5)' },
  { base: '#ff7924', deep: '#9f2708', glow: 'rgba(255, 121, 36, 0.56)' },
  { base: '#ff9d2e', deep: '#c44a0a', glow: 'rgba(255, 157, 46, 0.62)' },
  { base: '#ffc04f', deep: '#d66612', glow: 'rgba(255, 192, 79, 0.68)' },
  { base: '#ffde8a', deep: '#ff7a19', glow: 'rgba(255, 222, 138, 0.74)' }
];
let currentState = null;
let completionTonePlayedForToday = false;
let blessingAnimationRunning = false;
let currentView = 'home';
let editingReminderId = null;
let developerKeyBuffer = '';
let romanceKeyBuffer = '';

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function playBlessingCue(cue) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audioContext = new AudioContext();
  const gain = audioContext.createGain();
  const cueMap = {
    open: [220, 330],
    pillar: [392, 523.25, 784],
    roll: [659.25],
    lock: [784, 1046.5],
    jackpot: [523.25, 659.25, 783.99, 1046.5]
  };
  const notes = cueMap[cue] || cueMap.open;

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(cue === 'jackpot' ? 0.07 : 0.035, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + (cue === 'roll' ? 0.16 : 0.72));
  gain.connect(audioContext.destination);

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = cue === 'roll' ? 'square' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.07);
    oscillator.connect(gain);
    oscillator.start(audioContext.currentTime + index * 0.07);
    oscillator.stop(audioContext.currentTime + 0.2 + index * 0.09);
  });

  window.setTimeout(() => audioContext.close(), 900);
}

function playCompletionTone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audioContext = new AudioContext();
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.9);
  gain.connect(audioContext.destination);

  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.12);
    oscillator.connect(gain);
    oscillator.start(audioContext.currentTime + index * 0.12);
    oscillator.stop(audioContext.currentTime + 0.72 + index * 0.08);
  });

  window.setTimeout(() => audioContext.close(), 1100);
}

function celebrateCompletion() {
  document.body.classList.remove('ritual-complete-flash');
  window.requestAnimationFrame(() => {
    document.body.classList.add('ritual-complete-flash');
  });

  if (!completionTonePlayedForToday) {
    completionTonePlayedForToday = true;
    playCompletionTone();
  }
}
function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function applyHellTerminology(isHellSkin) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    const currentText = node.nodeValue;
    if (!currentText || !currentText.trim()) return;

    if (isHellSkin) {
      if (!currentText.includes('硫磺火')) {
        node.__baseText = currentText;
      }

      const baseText = node.__baseText || currentText.replaceAll('硫磺火', '圣水');
      node.nodeValue = baseText.replaceAll('圣水', '硫磺火');
      return;
    }

    if (node.__baseText) {
      node.nodeValue = node.__baseText;
      node.__baseText = null;
    }
  });
}

function refreshSkinTerminology() {
  applyHellTerminology(currentState && currentState.activeSkin === 'hell');
}

function isTypingTarget(element) {
  if (!element) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) || element.isContentEditable;
}

function getShiftSequenceCharacter(event) {
  if (/^Key[A-Z]$/.test(event.code)) {
    return event.code.slice(3).toLowerCase();
  }

  if (/^Digit[0-9]$/.test(event.code)) {
    return event.code.slice(5);
  }

  return '';
}

function getSequenceCharacter(event) {
  if (event.key.length !== 1) return '';
  return event.key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function updateRomanceEasterEgg(event) {
  const character = getSequenceCharacter(event);
  if (!character) return;

  romanceKeyBuffer = (romanceKeyBuffer + character).slice(-12);
  const phrases = ['missyou', 'missu', 'loveyou', 'iloveyou'];
  if (!phrases.some((phrase) => romanceKeyBuffer.endsWith(phrase))) return;

  romanceKeyBuffer = '';
  encouragement.textContent = 'I know';
}

function getBlessingAvailability(state) {
  if (state.developerMode) {
    return { available: true, status: 'Developer Mode：无限赐福测试已开启。' };
  }

  if ((state.totalCoins || 0) < 1) {
    return { available: false, status: '需要 1 枚圣水代币才可开启赐福。' };
  }

  return { available: true, status: '消耗 1 枚圣水代币，开启一次赐福。' };
}

function getFrequencyLabel(frequency) {
  if (frequency === 'weekdays') return '工作日';
  if (frequency === 'weekends') return '周末';

  return '每天';
}

function getDefaultReminderTime() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);

  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getReminderMode() {
  const activeButton = reminderModeButtons.find((button) => button.classList.contains('active'));
  return activeButton ? activeButton.dataset.reminderMode : 'fixed';
}

function setReminderMode(mode) {
  const nextMode = mode === 'interval' ? 'interval' : 'fixed';
  reminderModeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.reminderMode === nextMode);
  });
  reminderTimeField.hidden = nextMode !== 'fixed';
  reminderIntervalField.hidden = nextMode !== 'interval';
}

function getIntervalLabel(intervalMinutes) {
  const labels = {
    60: '每 1 小时',
    90: '每 1.5 小时',
    120: '每 2 小时',
    180: '每 3 小时'
  };

  return labels[Number(intervalMinutes)] || '每 1 小时';
}

function getReminderScheduleText(reminder) {
  return reminder.mode === 'interval'
    ? getIntervalLabel(reminder.intervalMinutes)
    : reminder.time;
}

function resetReminderForm() {
  editingReminderId = null;
  reminderTitleInput.value = '';
  setReminderMode('fixed');
  reminderTimeInput.value = getDefaultReminderTime();
  reminderIntervalInput.value = '60';
  reminderFrequencyInput.value = 'daily';
  reminderEnabledInput.checked = true;
  reminderSaveButton.textContent = '保存提醒';
  remindersStatus.textContent = '可以把吃药、站起来活动、伸懒腰这种事情也塞进来。';
}

function fillReminderForm(reminder) {
  editingReminderId = reminder.id;
  reminderTitleInput.value = reminder.title;
  setReminderMode(reminder.mode || 'fixed');
  reminderTimeInput.value = reminder.time;
  reminderIntervalInput.value = String(reminder.intervalMinutes || 60);
  reminderFrequencyInput.value = reminder.frequency || 'daily';
  reminderEnabledInput.checked = reminder.enabled !== false;
  reminderSaveButton.textContent = '更新提醒';
  remindersStatus.textContent = '正在编辑已有提醒，改完点更新提醒。';
  reminderTitleInput.focus();
  reminderTitleInput.select();
}

function describeReward(reward) {
  if (!reward) return '圣水瓶正在等待今日的光。';
  return reward.type === 'rareSkinFragments' ? `获得 ${reward.label} x${reward.amount}` : `获得 ${reward.label}`;
}

function getHiddenBlessingText() {
  return blessingAnimationRunning ? '圣水核心正在光柱中判定赐福。' : '圣水瓶正在等待今日的光。';
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function rewardIconMarkup(icon) {
  const paths = {
    'gold-small': 'assets/rewards/reward-water-gold-small.png',
    'gold-large': 'assets/rewards/reward-water-gold-large.png',
    'chest-open': 'assets/rewards/reward-chest-open.png',
    'chest-closed': 'assets/rewards/reward-chest-closed.png',
    sapphire: 'assets/rewards/reward-sapphire.png',
    diamond: 'assets/rewards/reward-diamond.png',
    fragment: 'assets/rewards/reward-fragment.png'
  };

  return '<img src="' + (paths[icon] || paths['gold-small']) + '" alt="">';
}
function getRewardDisplay(reward) {
  return reward.type === 'rareSkinFragments'
    ? { label: '稀有外观碎片', value: '+1', rarity: 'legendary', icon: 'fragment' }
    : {
        label: `${reward.amount} 圣水金币`,
        value: `+${reward.amount}`,
        rarity: reward.amount >= 50 ? 'epic' : reward.amount >= 20 ? 'rare' : 'common',
        icon: reward.amount >= 50 ? 'chest-open' : reward.amount >= 20 ? 'gold-large' : 'gold-small'
      };
}

function setSlotReward(item) {
  rewardSlot.dataset.rarity = item.rarity;
  rewardSlot.dataset.icon = item.icon;
  slotRewardIcon.className = 'slot-reward-icon ' + item.icon;
  slotRewardIcon.innerHTML = rewardIconMarkup(item.icon);
  slotRewardName.textContent = item.label;
  slotRewardValue.textContent = item.value;
  rewardSlot.classList.remove('tick');
  window.requestAnimationFrame(() => rewardSlot.classList.add('tick'));
}

function showReward(reward) {
  const display = getRewardDisplay(reward);
  rewardCard.dataset.rarity = display.rarity;
  rewardCard.dataset.icon = display.icon;
  rewardIcon.className = 'reward-card-icon ' + display.icon;
  rewardIcon.innerHTML = rewardIconMarkup(display.icon);
  rewardTitle.textContent = display.label;
  rewardSubtitle.textContent = display.value;
  rewardCard.classList.add('show');
}

async function rollBlessingSlot(finalReward) {
  const finalDisplay = getRewardDisplay(finalReward);
  const intervals = [36, 36, 38, 40, 42, 46, 52, 58, 68, 82, 102, 132, 172, 230, 310];

  rewardSlot.classList.add('rolling');
  for (let index = 0; index < intervals.length; index += 1) {
    const item = blessingRollItems[index % blessingRollItems.length];
    setSlotReward(item);
    if (index % 3 === 0) playBlessingCue('roll');
    await wait(intervals[index]);
  }

  setSlotReward(finalDisplay);
  rewardSlot.classList.remove('rolling');
  rewardSlot.classList.add('locked');
}

async function playBlessingAnimation(reward) {
  blessingAnimationRunning = true;
  rewardCard.classList.remove('show');
  rewardSlot.classList.remove('locked');
  blessingOverlay.classList.remove('charge', 'pillar', 'rolling', 'finale', 'jackpot');
  blessingOverlay.classList.add('active');
  blessingOverlay.setAttribute('aria-hidden', 'false');

  blessingOverlay.classList.add('charge');
  playBlessingCue('open');
  await wait(520);
  blessingOverlay.classList.add('pillar');
  playBlessingCue('pillar');
  await wait(760);
  blessingOverlay.classList.add('rolling');
  await rollBlessingSlot(reward);
  await wait(240);
  blessingOverlay.classList.add('finale');
  playBlessingCue('lock');
  await wait(360);
  blessingOverlay.classList.add('jackpot');
  playBlessingCue(reward.amount >= 50 || reward.type === 'rareSkinFragments' ? 'jackpot' : 'pillar');
  showReward(reward);
  await wait(2350);

  blessingOverlay.classList.remove('active', 'charge', 'pillar', 'rolling', 'finale', 'jackpot');
  blessingOverlay.setAttribute('aria-hidden', 'true');
  rewardCard.classList.remove('show');
  rewardSlot.classList.remove('locked', 'tick');
  blessingAnimationRunning = false;
}

function renderProgressSegments(state) {
  if (!progressSegments) return;

  progressSegments.innerHTML = '';
  progressSegments.style.setProperty('--segment-count', state.goal);
  const paletteSource = state.activeSkin === 'hell' ? hellSegmentPalette : segmentPalette;

  for (let index = 0; index < state.goal; index += 1) {
    const segment = document.createElement('span');
    const isFilled = index < state.cups;
    const charge = state.goal <= 1 ? 1 : index / (state.goal - 1);
    const paletteIndex = Math.min(paletteSource.length - 1, Math.floor(charge * paletteSource.length));
    const palette = paletteSource[paletteIndex];

    segment.className = isFilled ? 'filled' : '';
    segment.style.setProperty('--charge', charge.toFixed(2));
    segment.style.setProperty('--segment-color', palette.base);
    segment.style.setProperty('--segment-deep', palette.deep);
    segment.style.setProperty('--segment-glow', palette.glow);
    progressSegments.appendChild(segment);
  }
}

function setView(view) {
  currentView = view;
  const isShopView = view === 'shop';
  const isRemindersView = view === 'reminders';

  homeViewElements.forEach((element) => {
    if (element) element.hidden = isShopView || isRemindersView;
  });

  document.body.classList.toggle('shop-view', isShopView);
  document.body.classList.toggle('reminders-view', isRemindersView);
  shopPanel.hidden = !isShopView;
  remindersPanel.hidden = !isRemindersView;
}

function renderShop(state) {
  const ownedSkins = Array.isArray(state.ownedSkins) ? state.ownedSkins : ['sacred'];
  const activeSkin = state.activeSkin || 'sacred';
  const ownsOrigin = ownedSkins.includes('origin');
  const ownsHell = ownedSkins.includes('hell');
  const blessingCoins = state.blessingCoins || 0;
  const canBuyOrigin = blessingCoins >= 200;
  const canBuyHell = blessingCoins >= 500;

  shopCoinCount.textContent = blessingCoins;

  equipSacredButton.textContent = activeSkin === 'sacred' ? '使用中' : '装备';
  equipSacredButton.disabled = activeSkin === 'sacred';

  if (activeSkin === 'origin') {
    originSkinButton.textContent = '使用中';
    originSkinButton.disabled = true;
  } else if (ownsOrigin) {
    originSkinButton.textContent = '装备';
    originSkinButton.disabled = false;
  } else {
    originSkinButton.textContent = '200金币购买';
    originSkinButton.disabled = !canBuyOrigin;
  }

  if (activeSkin === 'hell') {
    hellSkinButton.textContent = '使用中';
    hellSkinButton.disabled = true;
  } else if (ownsHell) {
    hellSkinButton.textContent = '装备';
    hellSkinButton.disabled = false;
  } else {
    hellSkinButton.textContent = '500金币购买';
    hellSkinButton.disabled = !canBuyHell;
  }
}

function renderReminders(state) {
  const reminders = Array.isArray(state.customReminders) ? state.customReminders : [];
  const enabledCount = reminders.filter((reminder) => reminder.enabled !== false).length;

  remindersSummary.textContent = reminders.length
    ? `${enabledCount}/${reminders.length} 个提醒已启用`
    : '还没有额外提醒。';
  remindersList.innerHTML = '';

  if (!reminders.length) {
    const empty = document.createElement('p');
    empty.className = 'reminders-empty';
    empty.textContent = '先写一个事项、选好时间和频率，再保存。';
    remindersList.appendChild(empty);
    return;
  }

  reminders.forEach((reminder) => {
    const item = document.createElement('article');
    item.className = 'reminder-item';
    item.classList.toggle('disabled', reminder.enabled === false);

    const copy = document.createElement('div');
    copy.className = 'reminder-item-copy';

    const title = document.createElement('strong');
    title.textContent = reminder.title;

    const meta = document.createElement('span');
    meta.textContent = `${getReminderScheduleText(reminder)} / ${getFrequencyLabel(reminder.frequency)}`;

    copy.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'reminder-item-actions';

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.textContent = reminder.enabled === false ? '启用' : '停用';
    toggleButton.addEventListener('click', async () => {
      const nextState = await window.waterApp.saveCustomReminder({
        ...reminder,
        enabled: reminder.enabled === false
      });
      render(nextState);
      remindersStatus.textContent = reminder.enabled === false ? '提醒已启用。' : '提醒已停用。';
      refreshSkinTerminology();
    });

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = '编辑';
    editButton.addEventListener('click', () => fillReminderForm(reminder));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = '删除';
    deleteButton.addEventListener('click', async () => {
      const nextState = await window.waterApp.deleteCustomReminder(reminder.id);
      if (editingReminderId === reminder.id) resetReminderForm();
      render(nextState);
      remindersStatus.textContent = '提醒已删除。';
      refreshSkinTerminology();
    });

    actions.append(toggleButton, editButton, deleteButton);
    item.append(copy, actions);
    remindersList.appendChild(item);
  });
}

function render(state) {
  currentState = state;

  const progress = Math.min(state.cups / state.goal, 1);
  const percent = Math.round(progress * 100);
  const isComplete = state.cups >= state.goal;

  cupsCount.textContent = state.cups;
  goalCount.textContent = state.goal;
  coinCount.textContent = state.totalCoins || 0;
  blessingCoinCount.textContent = state.blessingCoins || 0;
  goalInput.value = state.goal;
  pausedInput.checked = state.paused;
  startupInput.checked = state.launchAtStartup;
  undoButton.disabled = state.cups <= 0;
  progressFill.style.width = `${percent}%`;
  renderProgressSegments(state);
  cupWater.style.height = `${Math.max(12, percent)}%`;
  document.body.classList.toggle('goal-complete', isComplete);
  document.body.classList.toggle('skin-origin', state.activeSkin === 'origin');
  document.body.classList.toggle('skin-hell', state.activeSkin === 'hell');

  developerBadge.hidden = !state.developerMode;
  developerTools.hidden = !state.developerMode;
  developerTokenInput.value = state.totalCoins || 0;
  developerCoinInput.value = state.blessingCoins || 0;
  developerToolsStatus.textContent = state.developerMode
    ? 'Developer Mode 已开启，可以直接调整数值。'
    : '';

  const blessingAvailability = getBlessingAvailability(state);
  blessingButton.disabled = blessingAnimationRunning || !blessingAvailability.available;
  blessingStatus.textContent = blessingAvailability.status;
  blessingResult.textContent = blessingAnimationRunning
    ? getHiddenBlessingText()
    : state.lastBlessingReward && state.lastBlessingReward.date === getTodayKey()
      ? describeReward(state.lastBlessingReward)
      : '圣水瓶正在等待今日的光。';

  if (!isComplete) {
    completionTonePlayedForToday = false;
  }

  intervalButtons.forEach((button) => {
    const isActive = Number(button.dataset.minutes) === state.intervalMinutes;
    button.classList.toggle('active', isActive);
  });

  const presetIntervals = intervalButtons.map((button) => Number(button.dataset.minutes));
  const isCustomInterval = !presetIntervals.includes(state.intervalMinutes);
  customIntervalOption.classList.toggle('active', isCustomInterval);
  customIntervalOption.textContent = isCustomInterval ? `${state.intervalMinutes}分钟` : '自定义时间';
  customIntervalInput.value = isCustomInterval ? state.intervalMinutes : state.customIntervalMinutes || state.intervalMinutes || 60;
  renderShop(state);
  renderReminders(state);
  applyHellTerminology(state.activeSkin === 'hell');
}

async function saveSettings(partialSettings) {
  const nextState = await window.waterApp.updateSettings(partialSettings);
  render(nextState);
}

drinkButton.addEventListener('click', async () => {
  const wasComplete = currentState && currentState.cups >= currentState.goal;
  const previousCoins = currentState ? currentState.totalCoins || 0 : 0;
  const nextState = await window.waterApp.drinkWater();
  const isComplete = nextState.cups >= nextState.goal;
  const earnedCoin = (nextState.totalCoins || 0) > previousCoins;

  render(nextState);
  encouragement.textContent = earnedCoin ? randomItem(coinMessages) : isComplete ? randomItem(completeMessages) : randomItem(encouragementMessages);
  refreshSkinTerminology();
  drinkButton.classList.remove('pop');
  window.requestAnimationFrame(() => drinkButton.classList.add('pop'));

  if (isComplete && !wasComplete) {
    celebrateCompletion();
  }
});
blessingButton.addEventListener('click', async () => {
  if (blessingAnimationRunning) return;

  blessingAnimationRunning = true;
  blessingButton.disabled = true;
  blessingResult.textContent = '圣水核心正在蓄力，请等待赐福降临。';

  const result = await window.waterApp.drawBlessing();
  blessingResult.textContent = getHiddenBlessingText();

  if (!result.ok) {
    blessingAnimationRunning = false;
    render(result.state);
    blessingResult.textContent = result.reason === 'token-insufficient'
      ? '圣水代币不足，完成今日补水可获得 3 枚。'
      : '暂时无法开启赐福。';
    refreshSkinTerminology();
    return;
  }

  await playBlessingAnimation(result.reward);
  render(result.state);
  blessingResult.textContent = describeReward(result.reward);
  encouragement.textContent = `圣水赐福完成：${describeReward(result.reward)}。`;
  refreshSkinTerminology();
});

developerSaveButton.addEventListener('click', async () => {
  const result = await window.waterApp.updateDeveloperCurrency({
    totalCoins: Number(developerTokenInput.value),
    blessingCoins: Number(developerCoinInput.value)
  });

  render(result.state);
  developerToolsStatus.textContent = result.ok ? '开发数值已保存。' : '需要先开启 Developer Mode。';
  refreshSkinTerminology();
});

undoButton.addEventListener('click', async () => {
  const nextState = await window.waterApp.undoWater();
  render(nextState);
  encouragement.textContent = '已撤回一杯，补水记录重新校准。';
  refreshSkinTerminology();
});

goalInput.addEventListener('change', () => {
  const goal = Number(goalInput.value);
  saveSettings({ goal });
});

pausedInput.addEventListener('change', () => {
  saveSettings({ paused: pausedInput.checked });
});

startupInput.addEventListener('change', () => {
  saveSettings({ launchAtStartup: startupInput.checked });
});

intervalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    saveSettings({ intervalMinutes: Number(button.dataset.minutes) });
  });
});

customIntervalOption.addEventListener('click', () => {
  customIntervalRow.hidden = !customIntervalRow.hidden;
  if (!customIntervalRow.hidden) {
    customIntervalInput.focus();
    customIntervalInput.select();
  }
});

customIntervalButton.addEventListener('click', () => {
  const intervalMinutes = Math.max(1, Math.min(1440, Math.round(Number(customIntervalInput.value) || 60)));
  customIntervalRow.hidden = true;
  saveSettings({ intervalMinutes, customIntervalMinutes: intervalMinutes });
});

customIntervalInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    customIntervalButton.click();
  }
});

shopEntryButton.addEventListener('click', () => {
  setView('shop');
  shopStatus.textContent = '购买后可以随时回来切换皮肤。';
  refreshSkinTerminology();
});

shopBackButton.addEventListener('click', () => {
  setView('home');
});

remindersEntryButton.addEventListener('click', () => {
  setView('reminders');
  resetReminderForm();
  refreshSkinTerminology();
});

remindersBackButton.addEventListener('click', () => {
  setView('home');
});

reminderResetButton.addEventListener('click', () => {
  resetReminderForm();
  refreshSkinTerminology();
});

reminderModeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setReminderMode(button.dataset.reminderMode);
  });
});

reminderSaveButton.addEventListener('click', async () => {
  const title = reminderTitleInput.value.trim();
  const mode = getReminderMode();
  const time = reminderTimeInput.value;

  if (!title) {
    remindersStatus.textContent = '先写一下要提醒的事项。';
    reminderTitleInput.focus();
    refreshSkinTerminology();
    return;
  }

  if (mode === 'fixed' && !time) {
    remindersStatus.textContent = '请选择一个固定提醒时间。';
    reminderTimeInput.focus();
    refreshSkinTerminology();
    return;
  }

  const currentReminder = currentState && Array.isArray(currentState.customReminders)
    ? currentState.customReminders.find((reminder) => reminder.id === editingReminderId)
    : null;
  const nextState = await window.waterApp.saveCustomReminder({
    ...(currentReminder || {}),
    id: editingReminderId || undefined,
    title,
    mode,
    time,
    intervalMinutes: Number(reminderIntervalInput.value),
    frequency: reminderFrequencyInput.value,
    enabled: reminderEnabledInput.checked
  });

  render(nextState);
  resetReminderForm();
  remindersStatus.textContent = '提醒已保存，到点就会弹出来。';
  refreshSkinTerminology();
});

reminderTitleInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    reminderSaveButton.click();
  }
});

window.addEventListener('keydown', async (event) => {
  if (currentView !== 'home' || isTypingTarget(document.activeElement)) {
    developerKeyBuffer = '';
    romanceKeyBuffer = '';
    return;
  }

  updateRomanceEasterEgg(event);

  if (!event.shiftKey) {
    developerKeyBuffer = '';
    return;
  }

  const character = getShiftSequenceCharacter(event);
  if (!character) return;

  developerKeyBuffer = (developerKeyBuffer + character).slice(-5);
  if (developerKeyBuffer !== 'dm333') return;

  developerKeyBuffer = '';
  const result = await window.waterApp.toggleDeveloperMode();
  render(result.state);
  encouragement.textContent = result.developerMode
    ? 'Developer Mode 已开启。'
    : 'Developer Mode 已关闭，回到普通模式。';
  refreshSkinTerminology();
});

equipSacredButton.addEventListener('click', async () => {
  const result = await window.waterApp.equipSkin('sacred');
  render(result.state);
  shopStatus.textContent = result.ok ? '已切换回神圣圣水皮肤。' : '暂时无法切换皮肤。';
  refreshSkinTerminology();
});

originSkinButton.addEventListener('click', async () => {
  const ownedSkins = currentState && Array.isArray(currentState.ownedSkins) ? currentState.ownedSkins : ['sacred'];
  const result = ownedSkins.includes('origin')
    ? await window.waterApp.equipSkin('origin')
    : await window.waterApp.buySkin('origin');

  render(result.state);
  shopStatus.textContent = result.ok
    ? '原初皮肤已装备。'
    : result.reason === 'coin-insufficient'
      ? '圣水金币不足，需要 200 枚。'
      : '暂时无法购买原初皮肤。';
  refreshSkinTerminology();
});

hellSkinButton.addEventListener('click', async () => {
  const ownedSkins = currentState && Array.isArray(currentState.ownedSkins) ? currentState.ownedSkins : ['sacred'];
  const result = ownedSkins.includes('hell')
    ? await window.waterApp.equipSkin('hell')
    : await window.waterApp.buySkin('hell');

  render(result.state);
  shopStatus.textContent = result.ok
    ? '恶魔地狱皮肤已装备。'
    : result.reason === 'coin-insufficient'
      ? '圣水金币不足，需要 500 枚。'
      : '暂时无法购买恶魔地狱皮肤。';
  refreshSkinTerminology();
});

window.waterApp.onStateChanged(render);

window.waterApp.getState().then((state) => {
  setView('home');
  render(state);
});

