$(document).ready(function () {

    $('.first-button').on('click', function () {
  
      $('.animated-icon1').toggleClass('open');
    });
    $('.second-button').on('click', function () {
  
      $('.animated-icon2').toggleClass('open');
    });
    $('.third-button').on('click', function () {
  
      $('.animated-icon3').toggleClass('open');
    });
  });

  //
  $(function(){
      $(document).ready(function(){
       $('.thumbnail').toggle('slide','right',1000);
       
      });
  })

   $('#btn').click(function(){
       $('.thumbnail').toggle('slide','left',1000);
   })