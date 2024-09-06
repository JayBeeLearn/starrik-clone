import React from 'react'

function aos() {
  return (
      <>
        <section class="works-section gap no-top">

		{/* <!--######################################  -->
		<!-- Advert Carousel goes here --> */}

		
		<div class="owl-wrapper py-16  new-slide"  >
			<div class="owl-carousel owl-theme mx-[20px] my-[50px]">
				<div class="item h-fit new-slide-height pr-36 ">
					<img src="./img/Starrik-D4-SL01.jpeg"
						alt="two Starrik dispatch riders holding delivery boxes on a motorcycle"  />
				</div>
				<div class="item h-fit new-slide-height">
					<img src="./img/Starrik-D4-SL02.jpeg" alt="starikk advert with fast and reliable service theme"
						 />
				</div>
				<div class="item h-fit new-slide-height">
					<img src="./img/Starrik-D4-SL03.jpeg" alt="starikk advert with fast and reliable service theme"
						 />
				</div>
				<div class="item h-fit new-slide-height">
					<img src="./img/Starrik-D4-SL04.jpeg" alt="starikk advert with fast and reliable service theme"
						 />
				</div>
			</div>
		</div>
		<div class="container">
			<div class="heading" data-aos="fade-up" data-aos-delay="200" data-aos-duration="300">
				<h2>How the Starrik Platform Works</h2>
				<p>Discover, as a user, the 4 simple and fast steps of getting your packages delivered in minutes.
				</p>
			</div>
			<div class="row d-flex justify-content-center"  >
				<div class="col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="200"
					data-aos-duration="300">
					<div class="work-card">
						<img alt="img" src="img/illustration-1.png" />
						<h4><span>01</span> Book a dispatch service</h4>
						<p>Get an excellent dispatch rider closest to you in your city. Our platform is location based,
							tailored to the respective and individual needs of our customers.
						</p>
					</div>
				</div>

				<div class="col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="300"
					data-aos-duration="400">
					<div class="work-card">
						<img alt="img" src="img/illustration-2.png" />
						<h4><span>02</span>Make payment </h4>
						<p>Once you have booked your delivery, proceed to make payments using any of our fast, simple
							and seamless methods of payment to make your payment and confirm your order.</p>
					</div>
				</div>

				<div class="col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="400"
					data-aos-duration="500">
					<div class="work-card">
						<img alt="img" src="img/illustration-3.png" />
						<h4><span>03</span> Track Your Delivery</h4>
						<p>Using our route optimization feature and AI live tracking feature, monitor the progress of
							your delivery. Immediately lodge your complaint should you suspect the movement and
							direction of the dispatch rider.</p>
					</div>
				</div>

				{/* <!-- added this section. Please remember to change the image --> */}

				<div class="col-lg-4 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="500"
					data-aos-duration="600">
					<div class="work-card">
						<img alt="delivery confirmation image" src="img/illustration-3.png" />
						<h4><span>04</span> Confirm Your Delivery</h4>
						<p>Confirm that your package has been delivered successfully. And proceed to rate the delivery
							service and possibly recommend tips that can help us serve you better. At Starrik, we are
							passionate about your experience.</p>
					</div>
				</div>

			</div>
		</div>
	</section>
      </>
  )
}

export default aos