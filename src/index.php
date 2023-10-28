<!DOCTYPE html>
<html lang="en">
<head>
	@@include('_head.html')
	<link rel="stylesheet" href="@@webRoot/assets/css/colors/grape.css">
	<link rel="preload" href="@@webRoot/assets/css/fonts/space.css" as="style" onload="this.rel='stylesheet'">
</head>
<body class="bg-soft-primary">
	<div class="content-wrapper">
		<header class="position-absolute w-100">
			<div class="gradient-5 text-white fw-bold fs-15 mb-2 position-relative" style="z-index: 1;">
				<div class="container py-2 text-center">
					<p class="mb-0">✨ Gestion des images avant l'import dans l'e-shop</p>
				</div>
				<!-- /.container -->
			</div>
			
		</header>
		<!-- /header -->
		<section class="wrapper overflow-hidden">
			<div class="container pt-19 pt-md-21 pb-16 pb-md-18 position-relative">
				<div class="position-absolute" style="top: -12%; left: 50%; transform: translateX(-50%);" data-cue="fadeIn"><img src="@@webRoot/assets/img/photos/blurry.png" alt=""></div>
				<div class="row position-relative">
					<div class="col-lg-8 col-xxl-7 mx-auto position-relative">
						<div class="position-absolute shape grape w-5 d-none d-lg-block" style="top: -5%; left: -15%;" data-cue="fadeIn" data-delay="1500"><img src="@@webRoot/assets/img/svg/pie.svg" class="svg-inject icon-svg w-100 h-100" alt="" /></div>
						<div class="position-absolute shape violet w-10 d-none d-lg-block" style="bottom: 30%; left: -20%;" data-cue="fadeIn" data-delay="1500"><img src="@@webRoot/assets/img/svg/scribble.svg" class="svg-inject icon-svg w-100 h-100" alt="" /></div>
						<div class="position-absolute shape fuchsia w-6 d-none d-lg-block" style="top: 0%; right: -25%; transform: rotate(70deg);" data-cue="fadeIn" data-delay="1500"><img src="@@webRoot/assets/img/svg/tri.svg" class="svg-inject icon-svg w-100 h-100" alt="" /></div>
						<div class="position-absolute shape yellow w-6 d-none d-lg-block" style="bottom: 25%; right: -17%;" data-cue="fadeIn" data-delay="1500"><img src="@@webRoot/assets/img/svg/circle.svg" class="svg-inject icon-svg w-100 h-100" alt="" /></div>
						<div data-cues="slideInDown" data-group="page-title">
							<h1 class="display5">Step #1</h1>
							<p>Si cette page est visible c'est que la conversion des fichiers dans le répertoire <code class="code">marbaise-origin</code> se sont converti vers le répertoire <code class="code">marbaise-webp</code>.</p>
							<p>Le répertoire <code class="code">marbaise-webp</code> est donc pret à être optimisé pour n'envoyer que le strict nécessaire sur le serveur.</p>
						</div>
						<hr class="my-5">
						<div data-cues="slideInDown" data-group="page-title">
							<h1 class="display5">Step #2</h1>
							<p>Afin de n'envoyer que le strict nécessaire sur le FTP, il est possible de comparer l'ensemble des images requises dans le fichier <code class="code">woocommerce2.xls</code> et de ne garder que le strit nécessaire.</p>
							<p>Placer le fichier dans <code class="code">src/assets/import_file/woocommerce2.xls</code> et cliquez sur le bouton ci-dessous.</p>

							<form class="contact-form needs-validation" method="get" action="@@webRoot/assets/php/image_to_prod.php" novalidate data-cues="slideInDown" data-group="page-title">
								<div class="messages"></div>
								<div class="row gx-4">
									<div class="col-12 text-center">
										<!-- <input type="submit" class="btn btn-primary rounded-pill btn-send mb-3" value="Vérifier le fichier woocommerce2.xls"> -->

										<button class="btn btn-primary btn-send" type="submit">
											<span class="spinner-grow spinner-grow-sm me-2 d-none" aria-hidden="true"></span>
											<span role="status" class="status">Vérifier le fichier woocommerce2.xls</span>
										</button>
									</div>
									<!-- /column -->
								</div>
								<!-- /.row -->
							</form>
							<!-- /form -->
						</div>

						
					</div>
					<!-- /column -->
				</div>
				<!-- /.row -->
			</div>
			<!-- /.container -->
		</section>
		<!-- /section -->
	</div>
	<!-- /.content-wrapper -->
	@@include('_page-progress.html')
	@@include('_scripts.html')
</body>
</html>