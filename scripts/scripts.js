$(function() {
  $(".scroll-top-src").on("scroll", function() {
    $(".scroll-top-dest").scrollTop($(this).scrollTop());
  });
  $(".scroll-left-src").on("scroll", function() {
      $(".scroll-left-dest").scrollLeft($(this).scrollLeft());
  })
});