<?php
class CustomFunctions {
  
    public static function cleanInput($data, $type = 'string') {
        //basic sanitization
        $data = trim($data);

        //zero is not empty
        if ($data === '0') return '0';
        if (empty($data)) return false;

        switch ($type) {
            case 'email':
                $data = filter_var($data, FILTER_SANITIZE_EMAIL);
                return filter_var($data, FILTER_VALIDATE_EMAIL) ? $data: false;
            case 'int':
                return filter_var($data, FILTER_VALIDATE_INT);
            case 'url':
                $data = filter_var($data, FILTER_SANITIZE_URL);
                return filter_var($data, FILTER_VALIDATE_URL) ? $data: false;
            case 'float':
                return filter_var($data, FILTER_VALIDATE_FLOAT); 
            case 'string':
            default:
                return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        }

    }
}

class MyApp {


	/**
	 * mysql data 
	 * 
	 * CREATE TABLE cart(
			id int AUTO_INCREMENT primary key,
			item_id int not null,
			cookie_id varchar(100),
			item_count int,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			updated_at datetime ON UPDATE CURRENT_TIMESTAMP,

			-- foreign key
			FOREIGN KEY (item_id) REFERENCES products(id) ON DELETE CASCADE
		);
	 * 
	 * 
	 */ 
	public function fetchcart($id = ''){ 
		// clean post data
		$post = json_decode(file_get_contents("php://input"),1);
		$cookieId = CustomFunctions::cleanInput($post['cookie_id']??$_POST['cookie_id']??$id??'', 'string');

		// own data fetch way
		$data = $this->_get('cart', 'cookie_id', [ $cookieId ]);
		echo json_encode([
			'total'=>$data[0],
			'cart'=>$data[1],
		]);
	} 
	public function savecart(){ 
		// clean post data
		$post = json_decode(file_get_contents("php://input"),1);
		$cookieId = CustomFunctions::cleanInput($post['cookie_id']??$_POST['cookie_id']??'', 'string');
		$itemId = $post['item_id']??$_POST['item_id']??'';

		if (!is_numeric($itemId )){
			die(json_encode(['error'=>true, 'msg'=>'Invalid Item ID']));
		}

		$data = $this->_get('cart', 'cookie_id,item_id', [$cookieId, $itemId], 0);

		if ($data[0] > 0) {
			//update count
			$this->_update("cart", 'item_count', 'cookie_id,item_id', [$data[1]['item_count']+1, $cookieId, $itemId] );
		} else {
			$this->_insert("cart", 'item_count, cookie_id,item_id', [1, $cookieId, $itemId] );
		}

		$this->fetchcart();
	} 
         


}
