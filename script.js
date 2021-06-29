const allitems = [
    { id:"1",  name:"T-Shirt 1", price:"250.00",  image:"images/tshirt-1.webp" },
    { id:"2",  name:"Hoodie 2",  price:"450.00",  image:"images/hoodie-2.webp" },
    { id:"3",  name:"Hoodie 3",   price:"300.00",  image:"images/hoodie-3.webp" },
    { id:"4",  name:"Kamiz 3",   price:"299.00",  image:"images/kamiz-3.webp" },
    { id:"5",  name:"Shirt 1",   price:"899.00",  image:"images/shirt-1.webp" },
    { id:"6",  name:"Kamiz 1",   price:"1250.00", image:"images/kamiz-1.webp" },
    { id:"7",  name:"Saree 2",   price:"4050.00", image:"images/saree-2.webp" },
    { id:"8",  name:"Shirt 3",   price:"750.00",  image:"images/shirt-3.webp" },
    { id:"9",  name:"T-Shirt 2", price:"230.00",  image:"images/tshirt-2.webp" },
    { id:"10", name:"Kamiz 2",   price:"580.00",  image:"images/kamiz-2.webp" },
    { id:"11", name:"Shirt 2",   price:"1890.00", image:"images/shirt-2.webp" },
    { id:"12", name:"Hoodie 1",  price:"520.00",  image:"images/hoodie-1.webp" },
    { id:"13", name:"Saree 4",   price:"3350.00", image:"images/saree-4.webp" },
    { id:"14", name:"Saree 3",   price:"3800.00", image:"images/saree-3.webp" },
    { id:"15", name:"Saree 1",   price:"2280.00", image:"images/saree-1.webp" }
]

const search    = document.getElementById(`search`),
      products  = document.getElementById(`products`),
      cart      = document.getElementById(`cart`),
      discount  = document.getElementById(`discount`),
      subtotal  = document.getElementById(`subtotal`),
      tax_perc  = document.getElementById(`tax_perc`),
      total_tax = document.getElementById(`total_tax`),
      total     = document.getElementById(`total`),
      pay       = document.getElementById(`pay`)


function load_products(items) {
    return function() {
	items.forEach(item => {
	    const card     = document.createElement(`div`),
		  card_img = document.createElement(`img`),
		  card_txt = document.createElement(`span`)

	    card_img.src       = item.image
	    card_txt.innerHTML = item.name

	    card.appendChild(card_img)
	    card.appendChild(card_txt)

	    card.classList  = `products__card`
	    card.onclick    = function() { add_to_cart(item.id) }
	    card.dataset.id = item.id
	    products.appendChild(card)
	})
	
	calculate_payment()
    }
}

function add_to_cart(item_id) {
    const cart_items = document.querySelectorAll(`.cart__item`)
    if(cart_items.length > 0) {
	for(let cart_item of cart_items) {
	    if(cart_item.dataset.id == item_id) {
		cart_item.dataset.count++
		calculate_payment()
		return
	    }
	}
    }

    const item       = document.createElement(`div`),
	  item_img   = document.createElement(`img`),
	  item_name  = document.createElement(`span`),
	  item_price = document.createElement(`span`),
	  item_del   = document.createElement(`button`)

    item_img.src         = allitems.find(obj => obj.id == item_id).image
    item_name.innerHTML  = allitems.find(obj => obj.id == item_id).name
    item_price.innerHTML = `BDT ${allitems.find(obj => obj.id == item_id).price}`
    item_del.innerHTML   = `<i class="fas fa-trash-alt"></i>`

    item_price.className = `itemprice`
    item_del.onclick = function() {
	if(item.dataset.count > 1)
	    item.dataset.count--
	else
	    cart.removeChild(item)

	calculate_payment()
    }

    item.appendChild(item_img)
    item.appendChild(item_name)
    item.appendChild(item_price)
    item.appendChild(item_del)
    
    item.className = `cart__item`
    item.dataset.id = item_id
    item.dataset.count = 1

    cart.appendChild(item)

    calculate_payment()
}

function calculate_payment() {
    let price_elem = document.querySelectorAll(`.itemprice`),
	discount_amt = parseFloat(discount.innerHTML.replace(/\D/g, ``)) / 100,
	subtotal_amt = 0,
	tax_perc_amt = parseFloat(tax_perc.innerHTML.replace(/\D/g, ``)),
	total_amt    = 0

    price_elem.forEach(elem => {
	subtotal_amt += parseInt(elem.parentNode.dataset.count) * (parseFloat(elem.textContent.replace(/\D/g, ``)) / 100)
    })

    total_tax_amt = subtotal_amt * (tax_perc_amt / 100)
    total_amt = subtotal_amt + total_tax_amt - discount_amt

    discount.innerHTML  = `- BDT ${discount_amt.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
    subtotal.innerHTML  = `BDT ${subtotal_amt.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
    total_tax.innerHTML = `BDT ${total_tax_amt.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
    total.innerHTML     = `BDT ${total_amt.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
    pay.innerHTML       = `BDT ${total_amt.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
}

search.addEventListener(`keypress`, evt => {
    if(evt.key === `Enter`) {
	evt.preventDefault();
	const txt = search.innerHTML.toLowerCase()

	while(products.firstChild)
	    products.removeChild(products.lastChild)

	if(txt.length === 0)
	    load_products(allitems, true)()
	else
	    load_products(allitems.filter(item => {return item.name.toLowerCase().includes(txt)}))()
    }
})


tax_perc.innerHTML = `Tax(0%)`
discount.innerHTML = `BDT 0.00`

document.addEventListener(`DOMContentLoaded`, load_products(allitems, false))
