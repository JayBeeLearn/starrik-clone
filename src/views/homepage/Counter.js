import React from 'react'

function Counter() {
  return (
      <>
        <section class="counters-section">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-lg-3 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="200"
					data-aos-duration="300">
					<div>
						<h2>Our Service in Numbers</h2>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="300"
					data-aos-duration="400">
					<div class="count-time">
						<h2 class="timer count-title count-number" data-to="3.5" data-speed="2000">3.5</h2>
						<span>k+</span>
						<p>Satisfied<br/>
							users</p>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="400"
					data-aos-duration="500">
					<div class="count-time">
						<h2 class="timer count-title count-number" data-to="2" data-speed="2000">2</h2>
						<span>k+</span>
						<p>trustworthy<br/>
							riders</p>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-sm-12" data-aos="flip-up" data-aos-delay="500"
					data-aos-duration="600">
					<div class="count-time sp">
						<h2 class="timer count-title count-number" data-to="11" data-speed="2000">4</h2>
						<span>k+</span>
						<p>confirmed <br/>
							deliveries</p>
					</div>
				</div>
			</div>
		</div>
	</section>
      </>
  )
}

export default Counter