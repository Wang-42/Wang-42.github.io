function open(address){
    var add = document.querySelectorAll(address);
    add.forEach(
        (value) => {
            value.onclick = () => {
                var box = value.nextElementSibling; 
                if(box.style.display === "none") box.style.display = "block";
                else box.style.display = "none";
            }
        }
    )
}


function slider() {
    var url = ['./asset/trangchu/images/slider1.jpg','./asset/trangchu/images/slider2.jpg','./asset/trangchu/images/slider3.jpg','./asset/trangchu/images/slider4.jpg'];
    var container = document.querySelector('.slider__link-img');
    var sliderText = document.querySelectorAll('.slider-item');
    var i=0;

    setInterval(
        () => {
            sliderText[i].classList.remove('slider-item--active');
            i = (i+1)%url.length;
            container.src = url[i];
            sliderText[i].classList.add('slider-item--active');
        }
    ,4000)
}
slider();

function main(){
    open('.question-item__tittle');
}

main();
