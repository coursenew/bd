// ========== HTML ফাইলের ভিতরে এই কোড বসান ==========

// 👇 এখানে আপনার Google Apps Script থেকে পাওয়া URL টা বসান
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzWG8qZEWo__5E4tkv7FScRGNaf9KPP8UZNx5JrrUOXHO-CheJPCOGHoRKhA1tNoSIs/exec';

function submitApplication() {
    if (!validateForm()) return;

    const name = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const address = document.getElementById('fAddress').value.trim();
    const question = document.getElementById('fMsg').value.trim();
    const selectedDuration = currentCourse.durations.find(d => d.value === durationSelect.value);

    // ডাটা তৈরি করুন
    const formData = {
        name: name,
        phone: phone,
        address: address,
        courseTitle: currentCourse.title,
        coursePrice: selectedDuration.price,
        message: question
    };

    // বাটন ডিজেবল করুন (ডাবল সাবমিট ঠেকাতে)
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'সাবমিট হচ্ছে...';

    // Google Sheet-এ পাঠান
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',  // CORS সমস্যা এড়াতে
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // সাকসেস মেসেজ দেখান
        successDetails.innerHTML = `
            <strong>✅ আপনার আবেদন সফল হয়েছে!</strong><br/><br/>
            📛 নাম: ${name}<br/>
            📞 ফোন: ${phone}<br/>
            📍 ঠিকানা: ${address}<br/>
            📚 কোর্স: ${currentCourse.title}<br/>
            💰 দাম: ${selectedDuration.price}<br/>
            ${question ? `❓ প্রশ্ন: ${question}<br/>` : ''}<br/>
            <span style="color: #059669;">আমাদের টিম শীঘ্রই যোগাযোগ করবে। ধন্যবাদ!</span>
        `;

        modalFormWrap.style.display = 'none';
        modalSuccess.classList.add('active');
        showToast('আবেদন জমা হয়েছে!', 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    })
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'আবেদন জমা দিন →';
    });
}