$(function() {
  $(".scroll-top").on("scroll", function() {
    $(".scroll-top").scrollTop($(this).scrollTop());
  });
  $(".scroll-left").on("scroll", function() {
      $(".scroll-left").scrollLeft($(this).scrollLeft());
  })
});