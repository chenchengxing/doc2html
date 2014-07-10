$(function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var $window = $(window);

  // .onload
  $('html').addClass('onload');

  // top link
  $('#top').click(function(e) {
    $('body').animate({
      scrollTop: 0
    }, 'fast');
    e.preventDefault();
  });

  // scrolling links
  var added;
  $window.scroll(function(e) {
    if ($window.scrollTop() > 5) {
      if (added) return;
      added = true;
      $('body').addClass('scroll');
    } else {
      $('body').removeClass('scroll');
      added = false;
    }
  })

  // highlight code
  $('pre.js code').each(function() {
    $(this).html(highlight($(this).text()));
  })
})

// active menu junk
$(function() {
  var $menu = $('#menu');
  $('h1').each(function(i, el) {
    var id = 'uniqueheading' + i;
    $(el).attr('id', id);
    var li = $('<li />');
    var liA = $('<a />').attr('href', '#' + id).text($(el).text());
    li.append(liA);
    $menu.append(li);
  });
});

$(window).load(function() {

  var prev;
  var n = 0;

  var headings = $('h1').map(function(i, el) {

    return {
      top: $(el).offset().top,
      id: $(el).attr('id')
    }
  });

  function closest() {
    var h;
    var top = $(window).scrollTop();
    var i = headings.length;
    while (i--) {
      h = headings[i];
      if (top >= h.top - 1) return h;
    }
  }

  $(window).scroll(scrollHandler);

  function scrollHandler() {
    var h = closest();
    if (!h) return;

    if (prev) {
      prev.removeClass('active');
      prev.parent().parent().removeClass('active');
    }

    var a = $('a[href="#' + h.id + '"]');
    a.addClass('active');
    a.parent().parent().addClass('active');

    prev = a;
  }
  scrollHandler();
})

/**
 * Highlight the given `js`.
 */

function highlight(js) {
  return js
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
    .replace(/('.*?')/gm, '<span class="string">$1</span>')
    .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
    .replace(/(\d+)/gm, '<span class="number">$1</span>')
    .replace(/\bnew *(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
    .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>')
}
