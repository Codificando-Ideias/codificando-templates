// Interacoes de tema e navegacao
$(function(){
  const key='burger_theme';
  const setTheme=t=>{$('body').attr('data-theme',t)};
  setTheme(localStorage.getItem(key)||'light');
  $('#themeToggle').on('click',()=>{const t=$('body').attr('data-theme')==='light'?'dark':'light';setTheme(t);localStorage.setItem(key,t);});
  $('.tab').on('click',function(){const id=$(this).data('screen');$('.tab').removeClass('active');$(this).addClass('active');$('.screen').removeClass('active');$('#'+id).addClass('active');});
  $('#contactForm').on('submit',function(e){e.preventDefault();$('#fb').text('Mensagem enviada.');});
});