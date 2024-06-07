
const carouselSteps = document.querySelector(".main__stepsMobile")
const arrowSteps = document.querySelectorAll(".main__toggleMobile button");
const leftArrow = document.getElementById("prevBtn")
const rightArrow = document.getElementById("nextBtn")
const firstCardWidthSteps = document.querySelector(".main__stepsMobile").offsetWidth
const toggles = document.querySelectorAll(".main__toggleItem")

let index = 0;

arrowSteps.forEach(btn => {
    btn.addEventListener("click", () => {
        carouselSteps.scrollLeft += btn.id === "prevBtn" ? -firstCardWidthSteps : firstCardWidthSteps;
        index += btn.id === "prevBtn" ? -1 : 1 
        toggles.forEach((item) => {
            item.classList.remove("active")
            toggles[index].classList.add("active")
        })
    })
});

const buttonDisabled = () => {
    if (carouselSteps.scrollLeft === 0) {
        const btn = leftArrow.querySelector(".left")
        leftArrow.setAttribute("disabled", true)
        btn.classList.remove("colorSvg")
    } else {
        const btn = leftArrow.querySelector(".left")
        leftArrow.removeAttribute("disabled")
        btn.classList.add("colorSvg")
    }

    if (Math.round(carouselSteps.scrollLeft) === carouselSteps.scrollWidth - carouselSteps.offsetWidth) {
        const btn = rightArrow.querySelector(".right")
        rightArrow.setAttribute("disabled", true)
        btn.classList.add("disabledSvg")
    } else {
        const btn = rightArrow.querySelector(".right")
        rightArrow.removeAttribute("disabled")
        btn.classList.remove("disabledSvg")
    }
}

carouselSteps.addEventListener("scroll", buttonDisabled)

const wrapper = document.querySelector(".main__players");
const carousel = document.querySelector(".main__cards");
const arrowBtns = document.querySelectorAll(".main__playersToggle button");
const firstCardWidth = document.querySelector(".main__card").offsetWidth;
const carouselChildren = [...carousel.children];
const currentNum = document.getElementById("currentCard")

let isDragging = false, startX, startScrollLeft, timeoutId;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

let current = cardPerView;

carouselChildren.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML)
})

carouselChildren.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML)
})

arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "prev" ? -firstCardWidth : firstCardWidth
        current += btn.id === "prev" ? -1 : 1
        currentNum.innerHTML = getCurrentCardNum()
    })
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging")
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft
}

const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging")
}

const autoPlay = () => {
    timeoutId = setTimeout(() => {
        current += 1
        currentNum.innerHTML = getCurrentCardNum()
        carousel.scrollLeft += firstCardWidth
    }, 4000)
}

autoPlay();

const infinityScroll = () => {
    if (carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition")
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth)
        carousel.classList.remove("no-transition")
    } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition")
        carousel.scrollLeft = carousel.offsetWidth
        carousel.classList.remove("no-transition")
    }

    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

function getCurrentCardNum() {
    if (current > carouselChildren.length) {
        current = cardPerView
    }
    if (current === 0) {
        current = carouselChildren.length
    }
    return current
}

carousel.addEventListener("mousedown", dragStart)
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infinityScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);