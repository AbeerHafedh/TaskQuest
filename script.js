let user = {
    points: 0,
    level: 1,
    streak: 0,
    avatar: "🌱",
    achievements: 0,
    ownedItems: ["🌱"]
};

let tasks = [];
let taskIdCounter = 1;
let currentFilter = 'all';
let searchTerm = '';

const shopItems = [
    { emoji: "⏰", name: "منبه", price: 30, id: "emoji1" },
    { emoji: "📚", name: "كتب", price: 40, id: "emoji2" },
    { emoji: "💪", name: "قوة", price: 60, id: "emoji3" },
    { emoji: "🏆", name: "كأس", price: 80, id: "emoji4" },
    { emoji: "👑", name: "تاج", price: 100, id: "emoji5" },
    { emoji: "🔥", name: "لهب", price: 120, id: "emoji6" },
    { emoji: "🚀", name: "صاروخ", price: 150, id: "emoji7" },
    { emoji: "💎", name: "ألماسة", price: 200, id: "emoji8" }
];

let dailyChallenges = [
    { name: "🔥 3 مهام قبل الظهر", completed: false, points: 30 },
    { name: "⭐ 5 مهام متتالية", completed: false, points: 50 },
    { name: "💫 مهمة بعد منتصف الليل", completed: false, points: 40 }
];

const levelQuotes = {
    1: "كل رحلة تبدأ بخطوة 👣",
    2: "أنتِ في الطريق الصحيح 🛤️",
    3: "ما يوقفج إلا الجدار 🧱",
    4: "إنجازج يتكلم عنج 🗣️",
    5: "منج إلهام للجميع ✨"
};

const levelAvatars = {
    1: "🌱", 2: "🌿", 3: "🌳", 4: "👑", 5: "🔥"
};

const levelNames = ["مبتدئ", "نشيطة", "بطلة", "أسطورة", "خارقة"];
const levelPoints = [0, 50, 150, 300, 500];

function showMessage(msg) {
    let msgBox = document.getElementById('progressMessage');
    msgBox.textContent = msg;
    msgBox.style.display = 'block';
    setTimeout(() => msgBox.style.display = 'none', 2000);
}

function updateLevel() {
    let oldLevel = user.level;
    if (user.points >= 500) user.level = 5;
    else if (user.points >= 300) user.level = 4;
    else if (user.points >= 150) user.level = 3;
    else if (user.points >= 50) user.level = 2;
    else user.level = 1;

    if (user.level > oldLevel) {
        showMessage(`🎉 ترقيتي للمستوى ${user.level}!`);
        if (!user.ownedItems.includes(levelAvatars[user.level])) {
            user.ownedItems.push(levelAvatars[user.level]);
        }
    }

    document.body.className = `level-${user.level}`;
    document.getElementById('levelDisplay').textContent = `مستوى ${user.level}`;
    document.getElementById('motivationQuote').textContent = levelQuotes[user.level];
}

function updateProgressBar() {
    let currentLevelPoints = levelPoints[user.level - 1];
    let nextLevelPoints = user.level < 5 ? levelPoints[user.level] : levelPoints[user.level - 1];
    let progressPercent = user.level < 5 ? ((user.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100 : 100;
    progressPercent = Math.min(100, Math.max(0, progressPercent));
    
    document.getElementById('levelProgressBar').style.width = `${progressPercent}%`;
    document.getElementById('progressPercent').textContent = `${Math.round(progressPercent)}%`;
    
    if (user.level < 5) {
        document.getElementById('nextLevelInfo').textContent = `${nextLevelPoints - user.points} نقطة للمستوى التالي`;
    } else {
        document.getElementById('nextLevelInfo').textContent = 'أقصى مستوى!';
    }
}

function addTask() {
    let taskName = document.getElementById('taskNameInput').value.trim();
    if (!taskName) {
        alert('دخلي اسم المهمة');
        return;
    }

    tasks.push({
        id: taskIdCounter++,
        name: taskName,
        points: parseInt(document.getElementById('taskPointsSelect').value),
        category: document.getElementById('taskCategory').value,
        completed: false
    });

    document.getElementById('taskNameInput').value = '';
    showMessage("✅ تمت الإضافة");
    updateUI();
}

function completeTask(taskId) {
    let task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        user.points += task.points;
        showMessage(`🎯 +${task.points} نقطة`);
        
        let completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === 5) { user.achievements++; showMessage("🏅 5 مهام!"); }
        if (completedCount === 10) { user.achievements++; showMessage("⭐ 10 مهام!"); }
        if (completedCount === 25) { user.achievements++; showMessage("💫 25 مهمة!"); }
        
        checkChallenges();
        updateLevel();
        updateUI();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    showMessage("🗑️ تم الحذف");
    updateUI();
}

function checkChallenges() {
    let completedCount = tasks.filter(t => t.completed).length;
    if (completedCount >= 3 && !dailyChallenges[0].completed) {
        dailyChallenges[0].completed = true;
        user.points += 30;
        user.achievements++;
    }
    
    let consecutive = 0;
    for (let t of tasks) {
        if (t.completed) consecutive++;
        else consecutive = 0;
        if (consecutive >= 5 && !dailyChallenges[1].completed) {
            dailyChallenges[1].completed = true;
            user.points += 50;
            user.achievements++;
            break;
        }
    }
}

function buyItem(itemId) {
    let item = shopItems.find(i => i.id === itemId);
    if (!item) return;
    
    if (user.points >= item.price && !user.ownedItems.includes(item.emoji)) {
        user.points -= item.price;
        user.ownedItems.push(item.emoji);
        user.avatar = item.emoji;
        document.getElementById('avatarEmoji').textContent = user.avatar;
        showMessage(`🛒 اشتريتي ${item.name}`);
        updateUI();
    } else if (user.ownedItems.includes(item.emoji)) {
        showMessage("✅ عندج مسبقاً");
    } else {
        showMessage(`💔 يحتاج ${item.price - user.points} نقطة`);
    }
}

function filterTasks() {
    let filtered = tasks;
    if (currentFilter === 'active') filtered = filtered.filter(t => !t.completed);
    else if (currentFilter === 'completed') filtered = filtered.filter(t => t.completed);
    if (searchTerm) filtered = filtered.filter(t => t.name.includes(searchTerm));
    return filtered;
}

function updateUI() {
    document.getElementById('pointsDisplay').textContent = user.points;
    document.getElementById('streakDisplay').textContent = user.streak;
    document.getElementById('avatarEmoji').textContent = user.avatar;
    
    let completed = tasks.filter(t => t.completed).length;
    document.getElementById('tasksCount').textContent = `${completed}/${tasks.length}`;
    document.getElementById('achievementsCount').textContent = user.achievements;
    
    updateProgressBar();

    let tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="task-item" style="justify-content:center">✨ أضيفي أول مهمة ✨</div>';
    } else {
        filterTasks().forEach(task => {
            let div = document.createElement('div');
            div.className = `task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <div class="task-info">
                    <span class="task-name">${task.name}</span>
                    <span class="task-category">${task.category}</span>
                    <span class="task-points">${task.points}</span>
                </div>
                <div class="task-actions">
                    ${!task.completed ? `<button class="complete-btn" onclick="completeTask(${task.id})">✓</button>` : ''}
                    <button class="delete-btn" onclick="deleteTask(${task.id})">✗</button>
                </div>
            `;
            tasksList.appendChild(div);
        });
    }

    let challengesDiv = document.getElementById('dailyChallenges');
    challengesDiv.innerHTML = '';
    dailyChallenges.forEach(c => {
        let div = document.createElement('div');
        div.className = `challenge-item ${c.completed ? 'completed' : ''}`;
        div.innerHTML = `<span>${c.name}</span><span>${c.completed ? '✅' : c.points}</span>`;
        challengesDiv.appendChild(div);
    });

    document.querySelectorAll('.shop-item').forEach((item, i) => {
        if (user.ownedItems.includes(shopItems[i].emoji)) {
            item.classList.add('disabled');
        } else {
            item.classList.remove('disabled');
        }
    });
}

document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('taskNameInput').addEventListener('keypress', (e) => e.key === 'Enter' && addTask());
document.getElementById('taskFilter').addEventListener('change', (e) => { currentFilter = e.target.value; updateUI(); });
document.getElementById('taskSearch').addEventListener('input', (e) => { searchTerm = e.target.value; updateUI(); });

document.getElementById('avatarEmoji').addEventListener('click', () => {
    if (user.ownedItems.length > 1) {
        let current = user.ownedItems.indexOf(user.avatar);
        user.avatar = user.ownedItems[(current + 1) % user.ownedItems.length];
        document.getElementById('avatarEmoji').textContent = user.avatar;
        showMessage("✨ غيرتي شكلج");
    }
});

document.querySelectorAll('.shop-item').forEach((item, i) => {
    item.addEventListener('click', () => buyItem(shopItems[i].id));
});

try {
    let savedTasks = localStorage.getItem('tasks');
    let savedUser = localStorage.getItem('user');
    if (savedTasks) { tasks = JSON.parse(savedTasks); taskIdCounter = tasks.length + 1; }
    if (savedUser) { 
        let u = JSON.parse(savedUser);
        user = { ...user, ...u };
    }
} catch (e) {}

updateLevel();
updateUI();

setInterval(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('user', JSON.stringify(user));
}, 3000);