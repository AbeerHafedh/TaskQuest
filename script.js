let user = {
    points: 0,
    level: 1,
    streak: 0,
    avatar: "🌱",
    achievements: 0,
    lastVisit: null,
    ownedItems: ["🌱"]
};

let tasks = [];
let taskIdCounter = 1;

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
    { name: "🔥 أنجزي 3 مهام قبل الظهر", completed: false, points: 30 },
    { name: "⭐ أنجزي 5 مهام متتالية", completed: false, points: 50 },
    { name: "💫 أكمل مهمة بعد منتصف الليل", completed: false, points: 40 }
];

const levelQuotes = {
    1: "كل رحلة تبدأ بخطوة 👣",
    2: "أنتِ في الطريق الصحيح 🛤️",
    3: "ما يوقفج إلا الجدار 🧱",
    4: "إنجازج يتكلم عنج 🗣️",
    5: "منج إلهام للجميع ✨"
};

const levelAvatars = {
    1: "🌱",
    2: "🌿",
    3: "🌳",
    4: "👑",
    5: "🔥"
};

function showMessage(msg) {
    let msgBox = document.getElementById('progressMessage');
    msgBox.textContent = msg;
    msgBox.style.display = 'block';
    setTimeout(function() {
        msgBox.style.display = 'none';
    }, 3000);
}

function checkStreak() {
    let today = new Date().toDateString();
    let lastVisit = localStorage.getItem('taskquest_lastVisit');
    
    if (lastVisit === today) {
        return;
    }
    
    if (lastVisit) {
        let lastDate = new Date(lastVisit);
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
            user.streak++;
            if (user.streak === 7) {
                showMessage("✨ أسبوع كامل من الإنجاز! فخورة فيج ✨");
            }
        } else {
            user.streak = 1;
            showMessage("🔄 بداية سلسلة جديدة ... شدي حيلج!");
        }
    } else {
        user.streak = 1;
    }
    
    localStorage.setItem('taskquest_lastVisit', today);
    updateUI();
}

function updateLevel() {
    let oldLevel = user.level;
    
    if (user.points >= 500) {
        user.level = 5;
    } else if (user.points >= 300) {
        user.level = 4;
    } else if (user.points >= 150) {
        user.level = 3;
    } else if (user.points >= 50) {
        user.level = 2;
    } else {
        user.level = 1;
    }

    if (user.level > oldLevel) {
        showMessage(`🎉 مبروك! ترقيتي للمستوى ${user.level} 🎉`);
        if (!user.ownedItems.includes(levelAvatars[user.level])) {
            user.ownedItems.push(levelAvatars[user.level]);
        }
    }

    document.body.className = '';
    document.body.classList.add(`level-${user.level}`);

    let levelNames = ["مبتدئ", "نشيطة", "بطلة", "أسطورة", "خارقة"];
    document.getElementById('levelDisplay').textContent = `مستوى ${user.level} - ${levelNames[user.level-1]}`;
    document.getElementById('motivationQuote').textContent = levelQuotes[user.level];
}

function addTask() {
    let taskName = document.getElementById('taskNameInput').value;
    let taskPoints = parseInt(document.getElementById('taskPointsSelect').value);

    if (!taskName) {
        alert('دخلي اسم المهمة');
        return;
    }

    let task = {
        id: taskIdCounter++,
        name: taskName,
        points: taskPoints,
        completed: false
    };

    tasks.push(task);
    document.getElementById('taskNameInput').value = '';
    showMessage("✅ تمت إضافة المهمة! شدي حيلج");
    updateUI();
}

function completeTask(taskId) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId && !tasks[i].completed) {
            tasks[i].completed = true;
            user.points += tasks[i].points;
            
            showMessage(`🎯 مبروك! +${tasks[i].points} نقطة`);
            
            let completedCount = 0;
            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].completed) completedCount++;
            }
            
            if (completedCount === 5) {
                user.achievements++;
                showMessage("🏅 أنجزتي 5 مهام! أول إنجاز");
            }
            if (completedCount === 10) {
                user.achievements++;
                showMessage("⭐ 10 مهام! طموحج عالي");
            }
            if (completedCount === 25) {
                user.achievements++;
                showMessage("💫 25 مهمة! شكد أنتِ ملهمة");
            }

            checkDailyChallenges();
            updateLevel();
            updateUI();
            break;
        }
    }
}

function deleteTask(taskId) {
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== taskId) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    showMessage("🗑️ تم حذف المهمة");
    updateUI();
}

function checkDailyChallenges() {
    let completedTasks = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) completedTasks++;
    }

    if (completedTasks >= 3 && !dailyChallenges[0].completed) {
        dailyChallenges[0].completed = true;
        user.points += dailyChallenges[0].points;
        user.achievements++;
        showMessage("🔥 تحدي 3 مهام قبل الظهر! مبروك");
    }

    let consecutiveCount = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            consecutiveCount++;
            if (consecutiveCount >= 5 && !dailyChallenges[1].completed) {
                dailyChallenges[1].completed = true;
                user.points += dailyChallenges[1].points;
                user.achievements++;
                showMessage("⭐ 5 مهام متتالية! إرادة قوية");
                break;
            }
        } else {
            consecutiveCount = 0;
        }
    }

    let now = new Date();
    if (now.getHours() >= 0 && now.getHours() < 6) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].completed && !dailyChallenges[2].completed) {
                dailyChallenges[2].completed = true;
                user.points += dailyChallenges[2].points;
                user.achievements++;
                showMessage("💫 مبروك! أنجزتي مهمة بالليل");
                break;
            }
        }
    }
}

function buyItem(itemId) {
    let item = null;
    for (let i = 0; i < shopItems.length; i++) {
        if (shopItems[i].id === itemId) {
            item = shopItems[i];
            break;
        }
    }

    if (!item) return;

    if (user.points >= item.price) {
        let alreadyOwned = false;
        for (let i = 0; i < user.ownedItems.length; i++) {
            if (user.ownedItems[i] === item.emoji) {
                alreadyOwned = true;
                break;
            }
        }

        if (!alreadyOwned) {
            user.points -= item.price;
            user.ownedItems.push(item.emoji);
            user.avatar = item.emoji;
            document.getElementById('avatarEmoji').textContent = user.avatar;
            showMessage(`🛒 اشتريتي ${item.name}! شكلج حلو`);
            updateUI();
        } else {
            showMessage("✅ عندج هالإيموجي مسبقاً");
        }
    } else {
        showMessage("💔 ما عندج نقاط كافية .. شدي حيلج");
    }
}

function updateUI() {
    document.getElementById('pointsDisplay').textContent = user.points;
    document.getElementById('streakDisplay').textContent = user.streak;
    document.getElementById('avatarEmoji').textContent = user.avatar;
    
    let completedCount = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) completedCount++;
    }
    document.getElementById('tasksCount').textContent = `${completedCount}/${tasks.length}`;
    document.getElementById('achievementsCount').textContent = user.achievements;

    let tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskDiv.innerHTML = `
            <div class="task-info">
                <span>${task.name}</span>
                <span class="task-points">${task.points} نقطة</span>
            </div>
            <div>
                ${!task.completed ? `<span class="complete-btn" onclick="completeTask(${task.id})">إنجاز</span>` : ''}
                <span class="delete-btn" onclick="deleteTask(${task.id})">❌</span>
            </div>
        `;
        
        tasksList.appendChild(taskDiv);
    }

    let challengesDiv = document.getElementById('dailyChallenges');
    challengesDiv.innerHTML = '';
    
    for (let i = 0; i < dailyChallenges.length; i++) {
        let challenge = dailyChallenges[i];
        let challengeDiv = document.createElement('div');
        challengeDiv.className = 'challenge-item';
        challengeDiv.style.background = challenge.completed ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)';
        challengeDiv.style.borderColor = challenge.completed ? '#4CAF50' : '#ff4444';
        
        challengeDiv.innerHTML = `
            <span>${challenge.name}</span>
            <span>${challenge.completed ? '✅' : `${challenge.points} نقطة`}</span>
        `;
        
        challengesDiv.appendChild(challengeDiv);
    }

    let shopDivs = document.querySelectorAll('.shop-item');
    for (let i = 0; i < shopDivs.length; i++) {
        let item = shopDivs[i];
        
        let owned = false;
        for (let j = 0; j < user.ownedItems.length; j++) {
            if (user.ownedItems[j] === shopItems[i].emoji) {
                owned = true;
                break;
            }
        }
        
        if (owned) {
            item.classList.add('disabled');
        } else {
            item.classList.remove('disabled');
        }
    }
}

document.getElementById('addTaskBtn').addEventListener('click', addTask);

document.getElementById('taskNameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.getElementById('avatarEmoji').addEventListener('click', function() {
    let nextAvatar = 0;
    for (let i = 0; i < user.ownedItems.length; i++) {
        if (user.ownedItems[i] === user.avatar) {
            nextAvatar = (i + 1) % user.ownedItems.length;
            break;
        }
    }
    user.avatar = user.ownedItems[nextAvatar];
    document.getElementById('avatarEmoji').textContent = user.avatar;
    showMessage("✨ غيرتي شكلج! حلو");
});

let shopItemElements = document.querySelectorAll('.shop-item');
for (let i = 0; i < shopItemElements.length; i++) {
    shopItemElements[i].addEventListener('click', function() {
        let itemId = this.getAttribute('data-item');
        buyItem(itemId);
    });
}

let savedTasks = localStorage.getItem('taskquest_tasks');
if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    taskIdCounter = tasks.length + 1;
}

let savedUser = localStorage.getItem('taskquest_user');
if (savedUser) {
    let parsed = JSON.parse(savedUser);
    user.points = parsed.points || 0;
    user.level = parsed.level || 1;
    user.streak = parsed.streak || 0;
    user.avatar = parsed.avatar || "🌱";
    user.achievements = parsed.achievements || 0;
    user.ownedItems = parsed.ownedItems || ["🌱"];
}

checkStreak();
updateLevel();
updateUI();

setInterval(function() {
    localStorage.setItem('taskquest_tasks', JSON.stringify(tasks));
    localStorage.setItem('taskquest_user', JSON.stringify(user));
}, 5000);