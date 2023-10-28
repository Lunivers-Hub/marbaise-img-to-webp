<?php 
use PhpOffice\PhpSpreadsheet\Spreadsheet;

require 'Spreadsheet/vendor/autoload.php';

$okMessage = 'We have received your inquiry. Stay tuned, we’ll get back to you very soon.';
$errorMessage = 'There was an error while submitting the form. Please try again later';

function get_images_from_excel(){

    $rootDir = realpath($_SERVER["DOCUMENT_ROOT"]);
    $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xls();
    $spreadsheet = $reader->load($rootDir."/assets/import_file/woocommerce2.xls");
    $worksheet = $spreadsheet->getActiveSheet();  
    $worksheet_arr = $worksheet->toArray();

    array_shift($worksheet_arr);
    $excel_images = [];
    $product_index = 1;

    foreach($worksheet_arr as $product){

        if ($product_index == 11) {
            // break;    /* You could also write 'break 1;' here. */
        }
        // Images
        if($product[20]){
            $image_1 = preg_replace('/\.\w+$/', '.webp', str_replace('Photos/Prestashop/', '', $product[20]));
            $image_1_noext = preg_replace('/\.\w+$/', '', $image_1);
            if(!in_array($image_1_noext, $excel_images)){
                $excel_images[] = $image_1_noext;
            }
        }
        if($product[28]){
            $image_2 = preg_replace('/\.\w+$/', '.webp', str_replace('Photos/Prestashop/', '', $product[28]));
            $image_2_noext = preg_replace('/\.\w+$/', '', $image_2);
            if(!in_array($image_2_noext, $excel_images)){
                $excel_images[] = $image_2_noext;
            }
        }
        if($product[29]){
            $image_3 = preg_replace('/\.\w+$/', '.webp', str_replace('Photos/Prestashop/', '', $product[29]));
            $image_3_noext = preg_replace('/\.\w+$/', '', $image_3);
            if(!in_array($image_3_noext, $excel_images)){
                $excel_images[] = $image_3_noext;
            }
        }
        if($product[30]){
            $image_4 = preg_replace('/\.\w+$/', '.webp', str_replace('Photos/Prestashop/', '', $product[30]));
            $image_4_noext = preg_replace('/\.\w+$/', '', $image_4);
            if(!in_array($image_4_noext, $excel_images)){
                $excel_images[] = $image_4_noext;
            }
        }
        
        $product_index++;
    }

    return $excel_images;
}

function get_images_from_wpallimport(){
    $wpallimport_images = [];
    $files_dir = dirname($_SERVER["DOCUMENT_ROOT"])."/marbaise-webp/";
    $existing_files = glob($files_dir . '*.webp');
    foreach($existing_files as $file) {
        // unlink($file);
        $wpallimport_images[] = basename(preg_replace('/\.\w+$/', '', $file));
        // $wpallimport_images[] = $file;
    }
    return $wpallimport_images;
}

function get_noexisting_files_from_import($images_from_wpallimport = [], $images_from_excel = []){

    $array_diff = [];

    if(!empty($images_from_wpallimport) && !empty($images_from_excel)){
        $array_diff = array_diff($images_from_wpallimport, $images_from_excel);
    }
    
    return $array_diff;
    // return $images_from_wpallimport;
}


try {
    // if(count($_POST) == 0) throw new \Exception('Form is empty');
    $rootDir = realpath($_SERVER["DOCUMENT_ROOT"]);
    if (!file_exists($rootDir."/assets/import_file/woocommerce2.xls")){
        throw new \Exception('Le fichier <code class="code">woocommerce2.xls</code> n\'existe pas. Il faut le glisser dans le répertoire <code class="code">src/assets/import_file/</code>');
    }

    $images_from_excel = get_images_from_excel();
    $images_from_wpallimport = get_images_from_wpallimport();
    $noexisting_files_from_import = get_noexisting_files_from_import($images_from_wpallimport, $images_from_excel);

    if(empty($noexisting_files_from_import)){
        throw new \Exception('Rien à supprimer tout est OK');
    }else{
        $files_dir = dirname($_SERVER["DOCUMENT_ROOT"])."/marbaise-webp/";
        foreach($noexisting_files_from_import as $file) {
            unlink($files_dir.$file.".webp");
        }
        $okMessage = count($noexisting_files_from_import). ' fichier(s) supprimé(s). Le répertoire <code class="code">marbaise-webp</code> peut être envoyé sur le FTP.';
    }

    $responseArray = array('type' => 'success', 'message' => $okMessage);
}
catch (\Exception $e) {
    $responseArray = array('type' => 'danger', 'message' => $e->getMessage());
}
// if requested by AJAX request return JSON response
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($responseArray); 
    header('Content-Type: application/json');
    echo $encoded;
}
// else just display the message
else {
    // echo $responseArray['message'];
    $encoded = json_encode($responseArray); 
    header('Content-Type: application/json');
    echo $encoded;
}
?>