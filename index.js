// 아코디언
(function () {
  const accordionMenuTitle = document.getElementsByClassName(
    "accordion-menu-title"
  );

  // 최초 첫 번째 요소 오픈 세팅
  const firstEle = accordionMenuTitle[0];
  firstEle.classList.add("on");
  const childrenLength = firstEle.nextElementSibling.children.length;
  firstEle.nextElementSibling.style.height = `${childrenLength * 35}px`;

  [...accordionMenuTitle].forEach((accordionMenutitleEle) => {
    accordionMenutitleEle.addEventListener("click", (e) => {
      [...accordionMenuTitle].forEach((titleEle) => {
        if (titleEle.textContent !== e.currentTarget.textContent) {
          titleEle.classList.remove("on");
          titleEle.nextElementSibling.style.height = "0px";
        } else {
          if (!e.currentTarget.classList.contains("on")) {
            e.currentTarget.classList.add("on");
            const childrenLength =
              e.currentTarget.nextElementSibling.children.length;
            e.currentTarget.nextElementSibling.style.height = `${
              childrenLength * 35
            }px`;
          } else {
            e.currentTarget.classList.remove("on");
            e.currentTarget.nextElementSibling.style.height = `0px`;
          }
        }
      });
    });
  });
})();
