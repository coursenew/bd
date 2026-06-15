// =====================================================
// 👇 আপনার Google Apps Script URL এখানে বসান
// =====================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxJSPYxiifZo0Bjd-eAu0L8vBmQLh_uRGzSqWeYUyQY9DBCplNJFzKuqIU7WGDNVR3j/exec';
// =====================================================

// কোর্সের ডেটা
let coursesData = [
  {
    id: 1,
    title: "মানব চিকিৎসা / LMAF",
    shortDesc: "আঘাত, দুর্ঘটনা ও জরুরি অবস্থায় প্রাথমিক চিকিৎসা প্রদানের দক্ষতা অর্জন করুন।",
    fullDesc: "মানব চিকিৎসা LMAF কোর্সে সীমিত আসনে ভর্তি চলছে শুক্রবার ক্লাস অভিজ্ঞ শিক্ষক দ্বারা প্র্যাক্টিক্যাল ও নিশ্চিত ক্যারিয়ার গড়তে আজই আসন নিশ্চিত করুন",
    icon: "🩺",
    tags: ["প্রাথমিক চিকিৎসা", "জরুরি সেবা", "লাইফ সেভিং"],
    durations: [
      { value: "6_months", label: "6 মাস", price: "৳ 15,500", seats: "200 জন" }
    ],
    defaultDuration: "6_months"
  },
  {
    id: 3,
    title: "ভেটেরিনারি পশু চিকিৎসা কোর্স",
    shortDesc: "পশুপাখির আকস্মিক রোগ আঘাত ও জরুরি অবস্থায় প্রাথমিক চিকিৎসা প্রদানের দক্ষতা অর্জন করুন",
    fullDesc: "ভেটেরিনারি পশু চিকিৎসা গরু ছাগল কোর্সে সীমিত আসনে ভর্তি চলছে শুক্রবার ক্লাস অভিজ্ঞ শিক্ষক দ্বারা প্র্যাক্টিক্যাল ও নিশ্চিত ক্যারিয়ার গড়তে আজই আসন নিশ্চিত করুন",
    icon: "🐄",
    tags: ["পশুপালন কোর্স", "আধুনিক প্রশিক্ষণ", "খামার ব্যবস্থাপনা"],
    durations: [
      { value: "6_months", label: "6 মাস", price: "৳ 18,500", seats: "200 জন" }
    ],
    defaultDuration: "6_months"
  }
];

// DOM Elements
const coursesGrid = document.getElementById('coursesGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalIcon = document.getElementById('modalIcon');
const modalDetail = document.getElementById('modalDetail');
const durationSelect = document.getElementById('durationSelect');
const modalFormWrap = document.getElementById('modalFormWrap');
const modalSuccess = document.getElementById('modalSuccess');
const successDetails = document.getElementById('successDetails');
const btnSubmit = document.getElementById('btnSubmit');
const toastMsg = document.getElementById('toastMessage');

let currentCourse = null;
let currentDurationData = null;

function showToast(message, type = 'success') {
  toastMsg.textContent = message;
  toastMsg.className = `toast-message ${type} show`;
  setTimeout(() => toastMsg.classList.remove('show'), 3000);
}

function renderCourses() {
  coursesGrid.innerHTML = '';
  coursesData.forEach(course => {
    const firstDur = course.durations[0];
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="course-image">${course.icon}</div>
      <div class="course-content">
        <h3 class="course-title">${course.title}</h3>
        <p class="course-desc">${course.shortDesc}</p>
        <div class="course-tags">
          ${course.tags.map(tag => `<span class="course-tag">${tag}</span>`).join('')}
        </div>
        <div class="course-meta">
          <div>
            <span class="course-price">${firstDur.price}</span>
            <div class="course-duration">${firstDur.label}</div>
          </div>
          <button class="cc-enroll" style="background:#059669;color:#fff;border:none;padding:10px 20px;border-radius:50px;font-weight:600;cursor:pointer;">ভর্তি হন →</button>
        </div>
      </div>
    `;
    card.querySelector('.cc-enroll').onclick = (e) => { e.stopPropagation(); openModal(course); };
    card.onclick = () => openModal(course);
    coursesGrid.appendChild(card);
  });
}

function updateDurationDisplay() {
  const selectedVal = durationSelect.value;
  const duration = currentCourse.durations.find(d => d.value === selectedVal);
  if (duration) {
    currentDurationData = duration;
    modalDetail.innerHTML = `
      <div class="detail-item"><span class="detail-label">📝 কোর্সের বিবরণ:</span><span class="detail-value">${currentCourse.fullDesc}</span></div>
      <div class="detail-item"><span class="detail-label">💰 কোর্স ফি:</span><span class="detail-value">${duration.price}</span></div>
      <div class="detail-item"><span class="detail-label">👥 আসন সংখ্যা:</span><span class="detail-value">${duration.seats}</span></div>
      <div class="detail-item"><span class="detail-label">⏱️ মেয়াদ:</span><span class="detail-value">${duration.label}</span></div>
      <div class="detail-item"><span class="detail-label">🏷️ বিষয়:</span><span class="detail-value">${currentCourse.tags.join(', ')}</span></div>
    `;
  }
}

function openModal(course) {
  currentCourse = course;
  modalIcon.textContent = course.icon;
  modalTitle.textContent = course.title;
  modalMeta.textContent = course.shortDesc;
  
  durationSelect.innerHTML = '<option value="">সিলেক্ট করুন</option>';
  course.durations.forEach(dur => {
    const option = document.createElement('option');
    option.value = dur.value;
    option.textContent = `${dur.label} - ${dur.price}`;
    durationSelect.appendChild(option);
  });
  
  if (course.durations.length === 1) {
    durationSelect.value = course.durations[0].value;
  } else {
    durationSelect.value = course.defaultDuration || course.durations[0].value;
  }
  updateDurationDisplay();
  
  document.getElementById('fName').value = '';
  document.getElementById('fPhone').value = '';
  document.getElementById('fAddress').value = '';
  document.getElementById('fMsg').value = '';
  
  document.querySelectorAll('.fg input, .duration-select').forEach(el => el.classList.remove('error'));
  
  modalFormWrap.style.display = 'block';
  modalSuccess.classList.remove('active');
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
  modalFormWrap.style.display = 'block';
  modalSuccess.classList.remove('active');
}

function validateForm() {
  let isValid = true;
  const name = document.getElementById('fName');
  const phone = document.getElementById('fPhone');
  const address = document.getElementById('fAddress');
  
  if (!name.value.trim()) {
    name.classList.add('error');
    showToast('পূর্ণ নাম দিন', 'error');
    isValid = false;
  } else name.classList.remove('error');
  
  if (!phone.value.trim()) {
    phone.classList.add('error');
    showToast('ফোন নম্বর দিন', 'error');
    isValid = false;
  } else if (!/^01\d{9}$/.test(phone.value.trim())) {
    phone.classList.add('error');
    showToast('সঠিক ফোন নম্বর দিন (01XXXXXXXXX)', 'error');
    isValid = false;
  } else phone.classList.remove('error');
  
  if (!address.value.trim()) {
    address.classList.add('error');
    showToast('আপনার সম্পূর্ণ ঠিকানা দিন', 'error');
    isValid = false;
  } else address.classList.remove('error');
  
  if (!durationSelect.value) {
    durationSelect.classList.add('error');
    showToast('কোর্সের মেয়াদ নির্বাচন করুন', 'error');
    isValid = false;
  } else durationSelect.classList.remove('error');
  
  return isValid;
}

async function submitApplication() {
  if (!validateForm()) return;
  
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const address = document.getElementById('fAddress').value.trim();
  const question = document.getElementById('fMsg').value.trim();
  const selectedDuration = currentCourse.durations.find(d => d.value === durationSelect.value);
  
  const postData = {
    name: name,
    phone: phone,
    address: address,
    courseTitle: currentCourse.title,
    coursePrice: selectedDuration.price,
    courseDuration: selectedDuration.label,
    message: question,
    timestamp: new Date().toISOString()
  };
  
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'সাবমিট হচ্ছে...';
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    
    successDetails.innerHTML = `
      ✅ আপনার আবেদন সফল হয়েছে!<br/><br/>
      📛 নাম: ${name}<br/>
      📞 ফোন: ${phone}<br/>
      📍 ঠিকানা: ${address}<br/>
      📚 কোর্স: ${currentCourse.title}<br/>
      ⏱️ মেয়াদ: ${selectedDuration.label}<br/>
      💰 দাম: ${selectedDuration.price}<br/>
      ${question ? `❓ প্রশ্ন: ${question}<br/>` : ''}<br/>
      <span style="color: #059669;">আমাদের টিম শীঘ্রই যোগাযোগ করবে। ধন্যবাদ!</span>
    `;
    
    modalFormWrap.style.display = 'none';
    modalSuccess.classList.add('active');
    showToast('আবেদন জমা হয়েছে!', 'success');
    
    console.log('ডাটা পাঠানো হয়েছে:', postData);
  } catch (error) {
    console.error('Error:', error);
    showToast('সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'আবেদন জমা দিন →';
  }
}

// Event Listeners
modalClose.addEventListener('click', closeModal);
closeSuccessBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
btnSubmit.addEventListener('click', submitApplication);
durationSelect.addEventListener('change', updateDurationDisplay);

// Start
renderCourses();
