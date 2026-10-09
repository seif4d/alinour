/* Works directly from index.html and from the optional local server. */
(()=>{
  'use strict';
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#main-nav');
  const closeMenu=()=>{toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','فتح القائمة');nav?.classList.remove('open');};
  toggle?.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'إغلاق القائمة':'فتح القائمة');
    nav.classList.toggle('open',open);
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();toggle.focus();}});
  matchMedia('(min-width:768px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

  // Reveals enhance the presentation without hiding content if APIs are unavailable.
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.documentElement.classList.add('reveal-enabled');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
  }

  const search=document.querySelector('#course-search');
  const filters=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('.course-list .course-card')];
  let category='all';
  const normalize=value=>value.normalize('NFKD').replace(/[\u064B-\u065F\u0670ـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').toLowerCase().trim();
  const updateCourses=()=>{
    const query=normalize(search?.value||'');let count=0;
    for(const card of cards){const visible=(category==='all'||card.dataset.category===category)&&normalize(card.dataset.search).includes(query);card.hidden=!visible;if(visible)count++;}
    filters.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    const empty=document.querySelector('.empty-state');if(empty)empty.hidden=count>0;
    const status=document.querySelector('.course-result');if(status)status.textContent=`عرض ${count} من ${cards.length} كورسات`;
    // File URLs remain supported; search state is useful for bookmarked HTTP previews.
    if(location.protocol!=='file:'){
      const url=new URL(location.href);category==='all'?url.searchParams.delete('category'):url.searchParams.set('category',category);
      query?url.searchParams.set('q',search.value.trim()):url.searchParams.delete('q');
      history.replaceState(null,'',url);
    }
  };
  filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;updateCourses();}));
  search?.addEventListener('input',updateCourses);
  document.querySelector('#reset-filters')?.addEventListener('click',()=>{category='all';search.value='';updateCourses();search.focus();});
  if(cards.length){const params=new URLSearchParams(location.search);const requested=params.get('category');if(filters.some(b=>b.dataset.filter===requested))category=requested;search.value=params.get('q')||'';updateCourses();}

  const dialog=document.querySelector('.gallery-dialog');
  const gallery=[...document.querySelectorAll('[data-gallery]')];
  let selected=0,lastFocus=null;
  const showImage=index=>{
    selected=(index+gallery.length)%gallery.length;const item=gallery[selected];
    const image=dialog.querySelector('figure>img');image.src=item.dataset.gallery;
    image.alt=item.querySelector('img')?.alt||item.dataset.caption||'صورة من الأنشطة';
    dialog.querySelector('figcaption').textContent=`${item.dataset.caption} — ${selected+1} / ${gallery.length}`;
  };
  gallery.forEach((item,index)=>item.addEventListener('click',()=>{
    if(typeof dialog?.showModal!=='function'){window.open(item.dataset.gallery,'_blank','noopener');return;}
    lastFocus=item;showImage(index);dialog.showModal();document.body.classList.add('modal-open');dialog.querySelector('.dialog-close').focus();
  }));
  dialog?.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
  dialog?.querySelector('.gallery-prev')?.addEventListener('click',()=>showImage(selected-1));
  dialog?.querySelector('.gallery-next')?.addEventListener('click',()=>showImage(selected+1));
  dialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus();});
  dialog?.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog?.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showImage(selected+1);}if(event.key==='ArrowRight'){event.preventDefault();showImage(selected-1);}});

  document.querySelector('#contact-form')?.addEventListener('submit',event=>{
    event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
    const data=new FormData(form);const name=String(data.get('name')).trim();const message=String(data.get('message')).trim();
    if(!name||message.length<10){form.querySelector('.form-status').textContent='يرجى كتابة الاسم ورسالة لا تقل عن 10 أحرف.';return;}
    const subject=String(data.get('topic'))+' — استفسار من الموقع';
    const body=`الاسم: ${name}\nالبريد: ${data.get('email')}\n\n${message}`;
    const href=`mailto:ali2003nor1@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const fallback=form.querySelector('.mail-fallback');fallback.href=href;fallback.hidden=false;
    form.querySelector('.form-status').textContent='تم تجهيز الرسالة لفتحها في تطبيق البريد. أكمل الإرسال من التطبيق؛ لم يرسل الموقع الرسالة.';
    location.href=href;
  });
})();
