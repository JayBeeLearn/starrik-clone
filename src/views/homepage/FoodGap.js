import React from 'react'

function FoodGap() {
  return (
      <>
        <section class="your-favorite-food gap" style={{ backgroundImage: "url(img/background-1.png)" }}>
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-5" data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
					<div class="food-photo-section">
						<img alt="img" src="img/photo-3.png" />
						<a href="#" class="one"><i class="fa-solid fa-box"></i>Parcels</a>
						<a href="#" class="two"><i class="fa-solid fa-shopping-bag"></i>Groceries</a>
						<a href="#" class="three"><i class="fa-solid fa-envelope"></i>Documents</a>
					</div>
				</div>
				<div class="col-lg-6 offset-lg-1" data-aos="fade-up" data-aos-delay="300" data-aos-duration="400">
					<div class="food-content-section">
						<h2>Deliver from the list of thousands of our trusted and excellent riders in your city</h2>
						<p>Get your packages, groceries and essentials delivered within minutes. It's simple, seamless
							and affordable.</p>
						<a href="#" class="button button-2">Order Now</a>
					</div>
				</div>
			</div>
		</div>
	</section>
      </>
  )
}

export default FoodGap