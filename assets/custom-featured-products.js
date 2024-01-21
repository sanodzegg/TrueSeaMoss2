const selectTab  = (e, flag) => {
  let selling_plan_input = e.closest('form').querySelector('.form-selling-plan');
  let totalPrice = e.closest('form').querySelector('.product__price--regular')
  let savedPrice = e.closest('form').querySelector('.product__price-save_badge span')
  let qty = e.closest('form').querySelector('.quantity__selector.quantity__input').value
  let currency = e.closest('form').querySelector('.quantity__selector.quantity__input').dataset.currency

  e.closest('.featured-subscribtion-tabs').querySelectorAll('.featured-subscribtion-tab-el').forEach((tab)=>{
    tab.classList.remove('featured-subscribtion-tab-active')
    
  })

  e.classList.add('featured-subscribtion-tab-active')
  

  if(flag === 'subscribe'){
    e.closest('form').querySelector('.recharge-product-widget__delivery-subscribe').style.display = 'flex'
    e.closest('form').querySelector('.recharge-product-widget__delivery-purchase').style.display = 'none'
    let selling_plan = e.closest('.featured-subscribtion-form').querySelector('.selling-plan-input').value
    if(selling_plan){
      selling_plan_input.value = selling_plan
    }
    totalPrice.innerHTML = currency + (+totalPrice.dataset.subscribeprice.split(currency)[1] * qty).toFixed(2)
    savedPrice.innerHTML = 'You save ' + currency + (+savedPrice.dataset.subscribeprice.split(currency)[1] * qty).toFixed(2)
  } 
  if(flag === 'purchase'){
    e.closest('form').querySelector('.recharge-product-widget__delivery-purchase').style.display = 'flex'
    e.closest('form').querySelector('.recharge-product-widget__delivery-subscribe').style.display = 'none'
      selling_plan_input.value = ''
      totalPrice.innerHTML = currency + (+totalPrice.dataset.originalprice.split(currency)[1] * qty).toFixed(2)
      savedPrice.innerHTML = 'You save ' + currency + (+savedPrice.dataset.originalprice.split(currency)[1] * qty).toFixed(2)
  }

}
window.addEventListener('load',()=>{
//   let selling_plan = document.querySelector('.selling-plan-input').value

  document.querySelectorAll('.selling-plan-input').forEach((input, index)=>{
    if(input.value){
      document.querySelectorAll('.form-selling-plan')[index].value = input.value
    }
  })
 
})
