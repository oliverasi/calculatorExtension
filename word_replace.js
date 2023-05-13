const text = document.querySelectorAll
('h1, h2, h2, h4, h5, p, li, td, caption, span, a')

for(let i=0; i<text.length; i++) {
    if(text[i].innerHTML.includes('Assi')) {
        text[i].innerHTML = text[i].innerHTML.
        replace('Assi', 'Ass')
    } else if(text[i].innerHTML.includes('ASSI')) {
        text[i].innerHTML = text[i].innerHTML.
        replace('ASSI', 'ASS')
    } else if(text[i].innerHTML.includes('assi')) {
            text[i].innerHTML = text[i].innerHTML.
            replace('assi', 'ass')
    }
}
