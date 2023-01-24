// const taxRate = 0.18;
// const shippingPrice = 15;
// const shippingFreePrice = 300;

window.addEventListener("load", () => {
    // localStorage.setItem("taxRate", taxRate);
    // localStorage.setItem("shippingPrice", shippingPrice);
    // localStorage.setItem("shippingFreePrice", shippingFreePrice);

    //show chart totals on window load!
    calculateCartPrice(); //sayfa yüklendiğinde otomatik olarak ürünler var olduğu için cart ın yani sepetin fiyatı hesaplanmış ve ekrana basılmış olmalı

});
//+ btn, - btn ,remove btn için ayrı ayrı eventlistener tanımlasak 100 ürün olduğunda veya yeni eklenen ürünlerde tekrar tekrar gezmek zorunda olmayalım diye yakalamak istediğimiz elementlerin en yakın parentini yakalıyoruz.
const productsDiv = document.querySelector(".products");
//Capturing ==> Static closest Parent ------> Children(dıştaki parenttan ulaşmak istediğim elemente doğru yakalama)yani ben parent elemente tıkladığımda içindeki diğer elementler de tetiklenmiş oluyor.
productsDiv.addEventListener("click", (e) => {
    //e.target vs. e.currentTarget
    // alert(e.target.tagName);target ile yakaladığım elementin tagName i gelir
    // alert(e.currentTarget.className); currentTarget ile yakaladığım elementin en yakın parentinin classsName ini alır.
    if (e.target.className === "fa-solid fa-minus") {
        // alert("minus btn clicked");
        if (e.target.nextElementSibling.innerText > 1) {
            e.target.nextElementSibling.innerText--;
            calculateProductPrice(e.target);
            //1 den büyük ise - butonuna bastığımızda birer birer azaltıp aynı zamanda product fiyat hesabını yapacak çağrılan fonksiyonla
        }
        else {
            //innerText vs. textContent(whitespaces) textContent boşlukları da içine alacak şekilde bizim önümüze serer.
            if (confirm(`${e.target.closest(".product-info").querySelector("h2").innerText} will be removed!`)) {
                e.target.closest(".product").remove();//ürünü silecek ,closest parentlara çıkmaya çalışmadan direkt nokta atışı ile alıyor.
            }
        }
        calculateCartPrice();
    }
    else if (e.target.classList.contains("fa-plus")) {
        // alert("plus btn clicked");
        e.target.parentElement.querySelector(".quantity").innerText++;
        calculateProductPrice(e.target);//neden e.target yazdık çünkü hangi ürünün toplam fiyatını hesaplıyorum?o ürünü yakalamam  ve ulaşmam gerek.
        calculateCartPrice();
    }
    else if (e.target.getAttribute("class") == "remove-product") {
        // alert("remove btn clicked");
        if (confirm(`${e.target.closest(".product-info").querySelector("h2").innerText} will be removed!`)) {
            e.target.closest(".product").remove();
        }
        calculateCartPrice();
    }
    else {
        alert("other element clicked");
    }

});

const calculateProductPrice = (target) => {
    //each product total calculation bu fonksiyon ürün bazında fiyat hesaplaması yapıyor.
    //productTotalPrice => quantity * price (quantity p nin içindeki artıp azalan ürün adedi ,price de product in içindeki strong ile çevrelenmiş fiyat bunları çarparak productun toplam fiyatını hesaplayacağız)+ btnuna bastım veya - butonuna bastım veya remove butonuna bastım o ürünün bilgilerine ulaşmakiçin  aynı zamanda span içinde yazan fiyatı da yakalamalıyım bunların hepsini kapsayan*** product-info***divini yakalamalıyım.
    const productInfoDiv = target.closest(".product-info");
    console.log(productInfoDiv);
    //unit price
    //div.class vs. .class as performance başına div. yazamasak da olur ama bu şekilde direkt nokta atışı oluyor ve daha hızlı çalışıyor.
    const price = productInfoDiv.querySelector("div.product-price strong").innerText;
    //quantity
    const quantity = productInfoDiv.querySelector("p.quantity").innerText;
    productInfoDiv.querySelector("div.product-line-price").innerText = (price * quantity).toFixed(2);
    //product line price classı ürünün altında yazan product total kısmının classı ,hesapladığımız şeyi oranın innertext ine göndermemiz gerek atamamız gerek.
}

const calculateCartPrice = () => {
    //cart total calculation from all products bu fonksiyon toplam sepet bazında hesaplama yapıyor
    //NodeList
    const productLinePriceDivs = document.querySelectorAll(".product-line-price");
    // const productLinePriceDivs = document.getElementsByClassName("product-line-price");

    //reduce vs. foreach !!!!! homework!!
    let subtotal = 0;
    //forEach => array + nodeList
    productLinePriceDivs.forEach(div => {
        subtotal += parseFloat(div.innerText);
    });
    console.log(subtotal);

    const taxPrice = subtotal * localStorage.getItem("taxRate");
    console.log(taxPrice);

    const shippingPrice = parseFloat(subtotal > 0 && subtotal < localStorage.getItem("shippingFreePrice") ? localStorage.getItem("shippingPrice") : 0);
    console.log(shippingPrice);

    const totalPrice = subtotal + taxPrice + shippingPrice;
    console.log(totalPrice);

    document.querySelector("#cart-subtotal").lastElementChild.innerText = subtotal.toFixed(2);

    document.getElementById("cart-tax").children[1].innerText = taxPrice.toFixed(2);

    document.querySelector("#cart-shipping p:nth-child(2)").innerText = shippingPrice.toFixed(2);

    document.querySelector("#cart-total p:last-child").innerText = totalPrice.toFixed(2);

}



