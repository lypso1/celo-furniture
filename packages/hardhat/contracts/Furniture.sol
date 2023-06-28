// SPDX-License-Identifier: MIT

// Version of Solidity compiler this program was written for
pragma solidity >=0.7.0 <0.9.0;

// Interface for the ERC20 token, in our case cUSD
interface IERC20Token {
    // Transfers tokens from one address to another
    function transfer(address, uint256) external returns (bool);

    // Approves a transfer of tokens from one address to another
    function approve(address, uint256) external returns (bool);

    // Transfers tokens from one address to another, with the permission of the first address
    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    // Returns the total supply of tokens
    function totalSupply() external view returns (uint256);

    // Returns the balance of tokens for a given address
    function balanceOf(address) external view returns (uint256);

    // Returns the amount of tokens that an address is allowed to transfer from another address
    function allowance(address, address) external view returns (uint256);

    // Event for token transfers
    event Transfer(address indexed from, address indexed to, uint256 value);
    // Event for approvals of token transfers
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// Contract for the marketplace
contract FurnitureMarketplace {
    // Keeps track of the number of furnitures in the marketplace
    uint256 internal productsLength = 0;
    // Address of the cUSDToken
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // Structure for a product
    struct Furniture {
        // Address of the product owner
        address payable owner;
        // Name of the product
        string name;
        // Link to an image of the product
        string image;
        // Description of the product
        string description;
        // Location of the product
        string location;
        // Price of the product in tokens
        uint256 price;
        // Number of times the product has been sold
        uint256 sold;
        // Number of likes
        uint256 likes;
    }

    // Mapping of furnitures to their index
    mapping(uint256 => Furniture) internal furnitures;

    // Store all the items put in the cart by a user bought buy a user
    mapping(address => mapping(uint256 => Furniture)) internal userCart;

    // Store the length of the user's cart
    mapping(address => uint256) internal userCartLength;

    // Store all the favourite info of a furniture
    mapping(uint256 => mapping(address => bool)) public favourites;

    // Writes a new product to the marketplace
    function writeProduct(
        string memory _name,
        string memory _image,
        string memory _description,
        string memory _location,
        uint256 _price
    ) public {
        // Number of times the product has been sold is initially 0 because it has not been sold yet
        uint256 _sold = 0;
        // Number of likes of a particular furniture
        uint256 _likes = 0;
        // Adds a new Furniture struct to the furnitures mapping
        furnitures[productsLength] = Furniture(
            // Sender's address is set as the owner
            payable(msg.sender),
            _name,
            _image,
            _description,
            _location,
            _price,
            _sold,
            _likes
        );
        // Increases the number of furnitures in the marketplace by 1
        productsLength++;
    }

    // Reads a product from the marketplace
    function readProduct(
        // Index of the product
        uint256 _index
    )
        public
        view
        returns (
            // Address of the product owner, payable because the owner can receive tokens
            Furniture memory
        )
    {
        // Returns the details of the product
        return (furnitures[_index]);
    }

    // Buys a product from the marketplace
    function buyProduct(
        // Index of the product
        uint256 _index
    ) public payable {
        // Transfers the tokens from the buyer to the seller
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                // Sender's address is the buyer
                msg.sender,
                // Receiver's address is the seller
                furnitures[_index].owner,
                // Amount of tokens to transfer is the price of the product
                furnitures[_index].price
            ),
            // If transfer fails, throw an error message
            "Transfer failed."
        );
        if(userCart[msg.sender][_index].owner != address(0)) {
            removeFromCart(msg.sender, _index);
        }
        // Increases the number of times the product has been sold
        furnitures[_index].sold++;
    }

    // Returns the number of furnitures in the marketplace
    function getProductsLength() public view returns (uint256) {
        return (productsLength);
    }

    // Function to add product to cart
    function addToCart(address user, uint256 _index) public {
        Furniture memory newFurniture = furnitures[_index];
        userCart[user][_index] = newFurniture;
        userCartLength[user] ++;
    }

    // Function to remove a product from the cart
    function removeFromCart(address user, uint256 _index) public {
        delete(userCart[user][_index]);
    }

    // Function to like a particular furniture
    function likeFurniture(uint256 _index) public {
        require(!favourites[_index][msg.sender], "Already liked this furniture");
        favourites[_index][msg.sender] = true;
        furnitures[_index].likes ++;
    }

    // Function to get furnitures from cart
    function readCart(address user, uint256 _index) public view returns(Furniture memory) {
        return userCart[user][_index];
    }

    // Function to get the number of elements in a particular cart
    function cartLength(address user) public view returns(uint256) {
        return userCartLength[user];
    }
}