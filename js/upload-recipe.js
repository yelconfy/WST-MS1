// js/upload-recipe.js
// Handles the two-step upload wizard and saving new recipes to RECIPES + localStorage.

(function () {
  // helpers
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const toast = (msg, t = 2200) => {
    const el = $('#toast');
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => el.style.display = 'none', t);
  };

  // DOM
  const step1 = $('#step1');
  const step2 = $('#step2');
  const toStep2Btn = $('#toStep2');
  const backToStep1Btn = $('#backToStep1');
  const resetBtn = $('#resetBtn');

  // Step1 fields
  const titleInput = $('#title');
  const descriptionInput = $('#description');
  const imageDrop = $('#imageDrop');
  const imageInput = $('#imageInput');
  const thumbsWrap = $('#thumbs');
  const prepTime = $('#prepTime');
  const cookTime = $('#cookTime');
  const servings = $('#servings');
  const difficulty = $('#difficulty');
  const category = $('#category');
  const cuisine = $('#cuisine');
  const tagsInput = $('#tagsInput');
  const tagsWrap = $('#tagsWrap');

  // Step2 fields
  const ingredientsList = $('#ingredientsList');
  const addIngredientBtn = $('#addIngredientBtn');
  const addGroupBtn = $('#addGroupBtn');
  const stepsList = $('#stepsList');
  const addStepBtn = $('#addStepBtn');
  const notesInput = $('#notes');
  const caloriesInput = $('#calories');
  const videoInput = $('#video');
  const publishBtn = $('#publishBtn');

  // image state
  let mainImageDataUrl = null;
  let extraThumbs = []; // just for UI; clicking shows "coming soon"

  // tags state
  let tags = [];

  // initial UI
  function showStep(n) {
    if (n === 1) {
      step1.classList.remove('hidden');
      step2.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Hook events
  toStep2Btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!titleInput.value.trim()) {
      toast('Please add a recipe title.');
      titleInput.focus();
      return;
    }
    // pass validation and go to step 2
    showStep(2);
  });

  backToStep1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    showStep(1);
  });

  resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!confirm('Reset the form?')) return;
    resetForm();
  });

  // image handling
  imageDrop.addEventListener('click', () => imageInput.click());
  imageInput.addEventListener('change', (ev) => handleFiles(ev.target.files));
  imageDrop.addEventListener('dragover', (ev) => { ev.preventDefault(); imageDrop.style.opacity = 0.8; });
  imageDrop.addEventListener('dragleave', (ev) => { ev.preventDefault(); imageDrop.style.opacity = 1; });
  imageDrop.addEventListener('drop', (ev) => {
    ev.preventDefault();
    imageDrop.style.opacity = 1;
    const files = ev.dataTransfer.files;
    handleFiles(files);
  });

  function handleFiles(list) {
    if (!list || list.length === 0) return;
    // take first file as main image
    const file = list[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      mainImageDataUrl = e.target.result;
      renderThumbs();
    };
    reader.readAsDataURL(file);

    // if user provided extras, add to extraThumbs but show coming soon when clicked
    if (list.length > 1) {
      for (let i = 1; i < list.length; i++) {
        const r = new FileReader();
        r.onload = (ev) => {
          extraThumbs.push(ev.target.result);
          renderThumbs();
        };
        r.readAsDataURL(list[i]);
      }
    }
  }

  function renderThumbs() {
    thumbsWrap.innerHTML = '';
    if (mainImageDataUrl) {
      const main = document.createElement('div');
      main.className = 'thumb';
      main.innerHTML = `<img src="${mainImageDataUrl}" style="width:100%;height:100%;object-fit:cover" />`;
      thumbsWrap.appendChild(main);
    } else {
      thumbsWrap.innerHTML = `<div class="small">No image yet</div>`;
    }

    extraThumbs.forEach((d, idx) => {
      const t = document.createElement('div');
      t.className = 'thumb';
      t.innerHTML = `<img src="${d}" style="width:100%;height:100%;object-fit:cover" />`;
      t.addEventListener('click', () => toast('Additional photos coming soon'));
      thumbsWrap.appendChild(t);
    });
  }

  // tags
  tagsInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      const v = tagsInput.value.trim();
      if (!v) return;
      tags.push(v);
      renderTags();
      tagsInput.value = '';
    }
  });

  function renderTags() {
    tagsWrap.innerHTML = '';
    tags.forEach((t, idx) => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.textContent = t + ' ×';
      el.addEventListener('click', () => {
        tags.splice(idx, 1);
        renderTags();
      });
      tagsWrap.appendChild(el);
    });
  }

  // ingredients & steps helpers
  function createIngredientRow(groupName = '') {
    const container = document.createElement('div');
    container.className = 'row-inline';
    container.innerHTML = `
      <input class="input" placeholder="Amount (e.g., 1 cup)" />
      <input class="input" placeholder="Ingredient name (e.g., all-purpose flour)" />
      <button class="btn btn-ghost small remove-btn">Remove</button>
    `;
    container.querySelector('.remove-btn').addEventListener('click', () => container.remove());
    return container;
  }

  function createGroupRow(groupName = 'Group') {
    const wrapper = document.createElement('div');
    wrapper.className = 'card';
    wrapper.style.padding = '12px';
    const title = document.createElement('div');
    title.style.display = 'flex';
    title.style.justifyContent = 'space-between';
    title.style.alignItems = 'center';
    title.innerHTML = `<strong>${groupName}</strong> <button class="btn btn-ghost small remove-group">Remove</button>`;
    wrapper.appendChild(title);
    const sublist = document.createElement('div');
    sublist.style.marginTop = '8px';
    sublist.appendChild(createIngredientRow());
    wrapper.appendChild(sublist);
    const add = document.createElement('div');
    add.style.marginTop = '8px';
    add.innerHTML = `<button class="btn btn-ghost small add-sub">+ Add</button>`;
    add.querySelector('.add-sub').addEventListener('click', () => sublist.appendChild(createIngredientRow()));
    add.querySelector('.add-sub').style.marginLeft = '0';
    wrapper.appendChild(add);

    wrapper.querySelector('.remove-group').addEventListener('click', () => wrapper.remove());
    return wrapper;
  }

  addIngredientBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ingredientsList.appendChild(createIngredientRow());
  });

  addGroupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const g = createGroupRow('New Group');
    ingredientsList.appendChild(g);
  });

  // create initial rows
  ingredientsList.appendChild(createIngredientRow());
  stepsList.appendChild(createStepRow());

  addStepBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    stepsList.appendChild(createStepRow());
  });

  function createStepRow() {
    const wrapper = document.createElement('div');
    wrapper.className = 'card';
    wrapper.style.padding = '10px';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.innerHTML = `
      <textarea class="input" placeholder="Describe this step in detail"></textarea>
      <div style="margin-top:8px; display:flex; gap:8px; align-items:center;">
        <button class="btn btn-ghost small remove-step">Remove</button>
        <span class="small">You can add photo/tips later (coming soon)</span>
      </div>
    `;
    wrapper.querySelector('.remove-step').addEventListener('click', () => wrapper.remove());
    return wrapper;
  }

  // gather data & publish
  publishBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    // basic validation
    const title = titleInput.value.trim();
    if (!title) { toast('Please add a title'); titleInput.focus(); return; }
    if (!mainImageDataUrl) { toast('Please upload a main image'); return; }

    // gather ingredients (both rows and groups)
    const ingredients = [];
    ingredientsList.querySelectorAll(':scope > *').forEach(node => {
      // if it's a group (card with add-sub)
      if (node.querySelector && node.querySelector('.add-sub')) {
        const groupTitle = node.querySelector('strong')?.textContent || 'Group';
        const items = [];
        node.querySelectorAll('input').forEach(inp => {
          const v = inp.value.trim();
          if (v) items.push(v);
        });
        if (items.length) ingredients.push({ group: groupTitle, items });
      } else {
        // simple row-inline
        const inputs = node.querySelectorAll('input');
        const amt = inputs[0]?.value.trim() || '';
        const name = inputs[1]?.value.trim() || '';
        if (amt || name) ingredients.push({ amount: amt, name });
      }
    });

    // steps
    const steps = [];
    stepsList.querySelectorAll('textarea').forEach(t => {
      const v = t.value.trim();
      if (v) steps.push(v);
    });

    // other fields
    const description = descriptionInput.value.trim();
    const prep = prepTime.value.trim();
    const cook = cookTime.value.trim();
    const servingsVal = servings.value.trim();
    const difficultyVal = difficulty.value;
    const categoryVal = category.value;
    const cuisineVal = cuisine.value;
    const notes = notesInput.value.trim();
    const caloriesVal = parseInt(caloriesInput.value.trim()) || null;
    const videoVal = videoInput.value.trim();

    // create id
    let newId = 1;
    try {
      if (Array.isArray(window.RECIPES) && window.RECIPES.length) {
        const maxId = window.RECIPES.reduce((m, r) => Math.max(m, r.id || 0), 0);
        newId = maxId + 1;
      }
    } catch (err) {
      newId = Date.now();
    }

    // build recipe object matching RECIPES schema
    const newRecipe = {
      id: newId,
      title,
      author: (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : 'You'),
      img: mainImageDataUrl,
      rating: 0,
      time: `${prep ? prep + ' prep • ' : ''}${cook ? cook : ''}`.trim(),
      calories: caloriesVal,
      servings: servingsVal || 1,
      tags: tags.slice(),
      difficulty: difficultyVal,
      likes: 0,
      comments: 0,
      inProgress: true, // newly created will default to inProgress
      description,
      ingredients,
      steps,
      notes,
      video: videoVal,
      createdAt: new Date().toISOString()
    };

    // push into global RECIPES and persist to localStorage (so pages that check localStorage will see it)
    try {
      if (!Array.isArray(window.RECIPES)) window.RECIPES = [];
      window.RECIPES.push(newRecipe);
      // persist to localStorage so reloads will use the augmented list
      localStorage.setItem('RECIPES', JSON.stringify(window.RECIPES));
    } catch (err) {
      console.error('Save failed', err);
      toast('Failed to save. Check console.');
      return;
    }

    // also save per-user (optional)
    try {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      if (user && user.username) {
        const key = `user_recipes_${user.username}`;
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push(newRecipe);
        localStorage.setItem(key, JSON.stringify(list));
      }
    } catch (err) {
      // ignore per-user save errors
    }

    toast('Recipe published — redirecting...', 900);
    setTimeout(() => {
      window.location.href = `recipe.html?id=${newId}`;
    }, 900);
  });

  // reset
  function resetForm() {
    titleInput.value = '';
    descriptionInput.value = '';
    mainImageDataUrl = null;
    extraThumbs = [];
    renderThumbs();
    prepTime.value = '';
    cookTime.value = '';
    servings.value = '';
    difficulty.value = 'Easy';
    category.value = '';
    cuisine.value = '';
    tags = [];
    renderTags();
    ingredientsList.innerHTML = '';
    ingredientsList.appendChild(createIngredientRow());
    stepsList.innerHTML = '';
    stepsList.appendChild(createStepRow());
    notesInput.value = '';
    caloriesInput.value = '';
    videoInput.value = '';
    showStep(1);
  }

  // small UX: clicking empty area of thumbs should open image picker
  thumbsWrap.addEventListener('click', () => imageInput.click());

  // init
  renderThumbs();
  showStep(1);

})();
