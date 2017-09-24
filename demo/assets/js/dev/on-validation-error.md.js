import anticore from 'anticore';

const
$ = anticore.utils.$;

anticore
.on('.error[data-for]', function(element, next) {
  const
  target = element.dataset.for,
  field = $(target);

  field.parentNode.insertBefore(element, field);

  next();
});