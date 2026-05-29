# Intersection Observer:

It is a Browser API, which helps to determine on which are all the DOM components/elements are visible within the browser viewport or within the given viewports, in a `async` manner.

```js
const callback = (entries, observer) => {
  // * entries -> a array of elements (target) whether they comeinto the viewport.
  // Based one the property isIntersecting - we can trigger the functionality
};

const option = {
  threshold: 0.1, // accepts 0 -> 1, a control which tells when the cb should trigger, here when target is 10% viewable, then trigger
  rootMargin: '0px', // a marging around the root
};

const observer = new IntersectionObserver(callback, option);

observer.observe(document.querySelector('#id')); // JS start observing for the element provided here

observer.unobserve(document.querySelector('#id')); // to cleanup
```
