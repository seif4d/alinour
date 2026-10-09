import fs from 'node:fs';

export function renderCenter({esc,img,button,link}) {
 const source=fs.readFileSync(new URL('./center-content.md',import.meta.url),'utf8').replace(/^\uFEFF/,'').replace(/\r/g,'');
 const inline=s=>esc(s).replace(/\b(01555999872|01094548482)\b/g,n=>`<a href="tel:+2${n}" dir="ltr">${n}</a>`).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+|tel:[^\s)]+)\)/g,'<a href="$2">$1</a>');
 function markdown(s) {
  return s.trim().split(/\n\s*\n/).filter(x=>x.trim()!=='---').map(block=>{
   if(/^#{1,3} /.test(block))return `<h3>${inline(block.replace(/^#{1,3} /,''))}</h3>`;
   if(/^(?:- |\d+\. )/.test(block))return `<ul>${block.split('\n').map(x=>`<li>${inline(x.replace(/^(?:- |\d+\. )/,''))}</li>`).join('')}</ul>`;
   return `<p>${inline(block).replace(/\n/g,'<br>')}</p>`;
  }).join('');
 }
 const sections=source.split(/\n# /);
 const first=sections.shift();
 const about=first.split('## من نحن')[1];
 const anchors=['massage','recovery','body-care','extras','personal-training','hours','booking','faq','center-contact'];
 const body=sections.map((section,i)=>{
  const split=section.indexOf('\n');const title=section.slice(0,split);const content=section.slice(split+1);
  if(i<4){
   const entries=content.split(/^## /m).filter(x=>x.trim()&&x.trim()!=='---');
   return `<section id="${anchors[i]}" class="center-services"><div class="center-section-heading"><span class="eyebrow">${String(i+1).padStart(2,'0')} / خدمات المركز</span><h2>${esc(title.replace(/^[^:]+:\s*/,''))}</h2></div><div class="center-service-list">${entries.map(entry=>{
    const pos=entry.indexOf('\n');const name=entry.slice(0,pos).replace(/^\d+ — /,'');const text=entry.slice(pos+1);
    const price=text.replace(/\*/g,'').match(/(?:السعر المعلن(?: للباقة)?|سعر الجلسة المعلن|السعر المذكور|الزيادة المعلنة):?\s*([^\n]+)/);
    return `<details class="center-service"><summary><span>${esc(name)}</span>${price?`<span class="center-service-price">${esc(price[1].trim())}</span>`:''}<span class="center-expand" aria-hidden="true">+</span></summary><div class="center-service-body">${markdown(text)}${link('استفسر عن الجلسة','tel:+201094548482')}</div></details>`;
   }).join('')}</div></section>`;
  }
  if(i===7){
   return `<section id="faq" class="center-services"><div class="center-section-heading"><span class="eyebrow">قبل الزيارة</span><h2>${esc(title)}</h2></div><div class="center-service-list">${content.split(/^### /m).filter(x=>x.trim()&&x.trim()!=='---').map(entry=>{const pos=entry.indexOf('\n');return `<details class="center-service"><summary><span>${esc(entry.slice(0,pos))}</span><span class="center-expand" aria-hidden="true">+</span></summary><div class="center-service-body">${markdown(entry.slice(pos+1))}</div></details>`;}).join('')}</div></section>`;
  }
  return `<section id="${anchors[i]}" class="center-info-section center-info-${i}"><div class="center-section-heading"><span class="eyebrow">Dr. Ali Nour Center</span><h2>${esc(title)}</h2></div><div class="center-richtext">${markdown(content)}</div></section>`;
 }).join('');
 return `<section class="container center-opening"><div class="center-opening-copy"><a href="index.html" class="breadcrumb">الرئيسية / المركز</a><span class="eyebrow" lang="en">Fitness & Recovery Center</span><h1>اعتنِ بجسمك.<br><span>استعد نشاطك.</span></h1><p class="center-name">مركز د. علي نور للتدريب والاستشفاء الرياضي</p><p>من جلسات المساج والعناية بالجسم إلى برامج التدريب الشخصي والتأهيل، اختر الخدمة المناسبة لاحتياجاتك في أسيوط.</p><div class="center-opening-actions">${button('احجز موعدك','tel:+201094548482')}${link('استكشف الخدمات','#massage')}</div><small>فترات منفصلة للرجال والسيدات · يُفضل الحجز قبل الزيارة</small></div><div class="center-opening-photo">${img('doctor-training.png','د. علي نور في صالة التدريب','',true)}<span>Dr. Ali Nour Center <small>Assiut · Fitness & Recovery</small></span></div></section><nav class="container center-nav" aria-label="أقسام صفحة المركز">${[['massage','المساج والتدليك'],['recovery','الاستشفاء والتأهيل'],['body-care','الحمام المغربي'],['personal-training','التدريب الشخصي'],['hours','المواعيد'],['booking','العنوان والحجز']].map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</nav><section class="container center-about"><div><span class="eyebrow">من نحن</span><h2>عناية بالجسم.<br>ومساحة للتدريب.</h2></div><div class="center-richtext">${markdown(about)}</div></section><div class="container center-catalogue"><p class="center-price-note">الأسعار والمواعيد الواردة وفق البيانات المقدمة للمركز؛ يُرجى تأكيد السعر الحالي وملاءمة الخدمة وتوافر الموعد عند الحجز.</p>${body}</div>`;
}
