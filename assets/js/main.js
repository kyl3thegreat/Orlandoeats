// ZOMATO API KEY
const zomatoApiKey = "278008af00b3a397d91a4d74db51300e"
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDOYpHtFpO_zc0j07ieVWpUT4CjceeEJ1g",
    authDomain: "project1-e5380.firebaseapp.com",
    databaseURL: "https://project1-e5380.firebaseio.com",
    projectId: "project1-e5380",
    storageBucket: "project1-e5380.appspot.com",
    messagingSenderId: "891558406446"
};
    
firebase.initializeApp(config);


// On Document Load
$(document).ready(function(){
    var currentPage = window.location.pathname
    console.log('Ready');

    console.log(window.location);

    // TEST > to see if user is on the index.html page
    if(window.location.pathname === currentPage){
        getOrlandoCollection()
        // TODO:
        // - dynamically build out html for the carousel include the ajax response from getOrlandoCollection()
    }
    // TEST > to see if user is on the collectionResuts.html page
    // if(window.location.pathname === '/collectionResults.html'){
    //     collectionId = localStorage.getItem('collectionId')
    //     getCollectionfromId(collectionId)
    //     localStorage.removeItem('collectionId')
    //     //TODO:
    // }
     // Check to see if current page is the collectionResults page
     if($('#collectionResults').length > 0){
        console.log('On collection results page');
        collectionId = localStorage.getItem('collectionId')
        getCollectionfromId(collectionId)
        localStorage.removeItem('collectionId')
    }
    // TEST > to see if user is on the restaurantView.html page
    if(window.location.pathname === '/restaurantView.html'){
        resId = localStorage.getItem('resId')
        getRestaurant(resId)
        localStorage.removeItem('resId')
        //TODO:

    }


    // ======= FIREBASE AUTHENTICATION ONCHANGE LISTENER ======= //
    // Listen for authentication state changes 
    firebase.auth().onAuthStateChanged(function(user) {
        // when user signs in
        if (user) {
            // User is signed in.
            console.log(user);
            // make visual changes to nav links
            $('.logOut').removeClass('hidden')
            $('.profile').removeClass('hidden')
            $('.logIn').addClass('hidden')
            $('.signUp').addClass('hidden')

            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            
            // Check to see if current page is the profile page
            if($('#profile').length > 0){
                console.log('On profile page');
                buildUserProfile(displayName, photoURL, email, emailVerified, uid)
            }


        // when user signs out
        } else {
            // User is signed out.
            // make visual changes to nav links
            $('.logOut').addClass('hidden')
            $('.profile').addClass('hidden')
            $('.logIn').removeClass('hidden')
            $('.signUp').removeClass('hidden')
        // ...
        }
    });


    // Database no in use yet
    //var database = firebase.database()
    // // when user submits
    // $("#submit").on("click", function(event) {
    //     event.preventDefault();
    // })


    // triggers dropdown menu
    $('.dropdown-trigger').dropdown();
    // modal popups
    $('.modal').modal();
    // carousel functionality
    $('.carousel').carousel();
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    //profile page tabs functionality
    $('.tabs').tabs();

    
}) // << Document load end







// ====== GLOBAL SITE FUNCTIONS ====== //

    // Build collections cards
    function buildCollectionCards(collections){
        console.log(collections)
        collections.forEach(collection => {
            console.log(collection)
            $('.collectionsDiv').append('<div class="card collectionCard" data-collectionId="'+collection.collection.collection_id+'">'+
                                            '<div class="col s12 m4 l4 collections">'+
                                                '<img src="'+collection.collection.image_url+'" class="collectionImage">'+
                                                '<h5>' + collection.collection.title + '</h5>'+
                                            '</div>'+
                                        '</div>')
        })
    }

    // Build the html for the restaurant view
    function buildRestaurantView(restaurant){
        $('#restaurant').append('<div class="row">'+
                                    '<div class="col s12 m6">'+
                                        '<div class="card blue-grey darken-1">'+
                                            '<div class="card-content white-text">'+
                                                '<span class="card-title">Card Title</span>'+
                                                '<p>'+ JSON.stringify(restaurant) +'</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>')            
    }

    // Build the html for the collection results
    function buildCollectionRestults(restaurants){
        console.log("Restuarants " + restaurants);
        restaurants.forEach(restaurant => {
            console.log(restaurant);

        $('#collectionResults .row').append('<div class="col s12 m6 l4 xl3">'+
                                                '<div class="card blue darken-2">'+
                                                    '<div class="card-content white-text">'+
                                                        '<h1 class="card-title resName">'+ restaurant.restaurant.name +'</h1>'+
                                                        '<p class="resAddress">'+ restaurant.restaurant.location.address +'</p>'+
                                                        '<div class="collectionActions">'+
                                                            '<p class="costForTwo"><i class="material-icons">attach_money</i>'+ restaurant.restaurant.average_cost_for_two +'</p>'+
                                                            '<p class="averageRating"><i class="material-icons">group</i>'+ restaurant.restaurant.user_rating.aggregate_rating +'</p>'+
                                                            '<p class="favorite"><i class="material-icons">favorite_border</i></p>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    //'<img src="https://maps.googleapis.com/maps/api/staticmap?center="",""&zoom=12&size=400x400&maptype=roadmap&key=AIzaSyAszJS7qyZAOemVMSlfRNJ4FDj5uGI-m1M">'+
                                                '</div>'+
                                            '</div>')    
        });

    }

    // Builds html for the User Profile
    function buildUserProfile(name, photoUrl, email, emailVerified, uid){
        $('#profile').append('<div class="userProfile">'+
        '<h3>User Profile</h3>'+
        '<h5 class="name">Name: <span class="userName">'+ name +'</span></h3>'+
        '<h5 class="email">Email: <span class="userEmail">'+ email +'</span></h3>'+
        '<h5>UID: <span class="userUid">'+ uid +'</span></h3>'+
        '<button id="editProfile">Edit Profile</button>'+
        '</div>')
    }

    //======AJAX REQUEST FUCTIONS======//
    function getOrlandoCollection(){
        $.ajax({
            url: 'https://developers.zomato.com/api/v2.1/collections?city_id=601',
            method: 'GET',
            headers: {
                "user-key": zomatoApiKey
            }
        }).then((data) => {
            // on response call buildCollections(response as Parameters) function to build html
            // TODO: Create buildCollections(data) function
            var collectionsData = data.collections
            console.log(collectionsData)
            buildCollectionCards(collectionsData)
        }).catch((err) => {
            console.log(err); // Error handler
        })
    }

    function getCollectionfromId(collectionId){
        // AJAX request to get results based on collectionId
        $.ajax({
            url: 'https://developers.zomato.com/api/v2.1/search?entity_id=601&entity_type=city&collection_id=' + collectionId,
            method: 'GET',
            headers: {
                "user-key": zomatoApiKey
            }
        }).then((data) => {
            console.log(data)
            collectionData = data.restaurants
            buildCollectionRestults(collectionData)
            // on response call buildCollections(response as Parameters) function to build html
            // TODO: Create buildResults(data) function
        }).catch((err) => {
            console.log(err); // Error handler
        })
    }

    function getRestaurant(resId){
        // AJAX request to get results based on collectionId
        $.ajax({
            url: 'https://developers.zomato.com/api/v2.1/restaurant?res_id=' + resId,
            method: 'GET',
            headers: {
                "user-key": zomatoApiKey
            }
        }).then((data) => {
            console.log(data)
            buildRestaurantView(data)
            // on response call buildRestaurant(response as Parameters) function to build html
            // TODO: Create buildRestaurant(data) function
        }).catch((err) => {
            console.log(err); // Error handler
        })

    }

    
    
    
// ====== GLOBAL SITE LISTENERS ====== //


    // ======= ON COLLECTION CLICK LISTENER ======= //
    $('.collectionsDiv').on('click', '.collectionCard', (e) => {
        console.log(e.currentTarget.dataset.collectionid);
        var collectionId = e.currentTarget.dataset.collectionid
        localStorage.setItem('collectionId', collectionId)
        window.location.replace('collectionResults.html')
    })

    // ======= ON RESTAURANT CLICK LISTENER ======= //
    $('.collection').on('click', '.collection-item', (e) => {
        console.log(e.currentTarget.dataset.resid);
        var resId = e.currentTarget.dataset.resid
        localStorage.setItem('resId', resId)
        window.location.replace('restaurantView.html')
    })


    // =======  USER SIGN UP LISTENER ======= //
    // When user submits the sign up form
    $('#modal1').on('click', '#signUpSubmit', (e) => {
        // prevent default submit
        e.preventDefault()

        // grab the email value
        var email = $('#signUpForm .email').val().trim()
        // grab the password value
        var password = $('#signUpForm .password').val().trim()
        // grab the password confirm value
        var passwordConfirm = $('#signUpForm .passwordConfirm').val().trim()

        // run simple validation against the inputs
        if(email.length < 1){
            console.log('Enter a valid email address');
            if (password !== passwordConfirm) {
                console.log('Check Passwords');
            }
        }
        else if (password !== passwordConfirm)  {
            console.log('Check passwords');
        }
        else {
            // once validtions pass
            console.log('Passed Validation Created new User');
            // run createUserWithEmailAndPassword
            firebase.auth().createUserWithEmailAndPassword(email, password).then(()=> {
                // Empty out the input values
                $('#signUpForm .email').val('')
                $('#signUpForm .password').val('')
                $('#signUpForm .passwordConfirm').val('')
                // Refresh the page
                window.location.replace('index.html')

            }).catch((error) => {
                console.log(error.code);
                console.log(error.message);                
            })
        }
    })

    // =======  USER SIGN IN LISTENER ======= //
    // When user submits the Login form
    $('#modal2').on('click', '#signInSubmit', (e) => {
        // prevent default submit
        e.preventDefault()

        // grab the email value
        var email = $('#signInForm .email').val().trim()
        // grab the password value
        var password = $('#signInForm .password').val().trim()

        // run simple validation against the inputs
        if(email.length < 1){
            console.log('Enter a valid email address');
            if (password.length < 1) {
                console.log('Enter Password');
            }
        }
        else if (password.length < 1)  {
            console.log('Check passwords');
        }
        else {
            // once validtions pass
            console.log('Passed Validation Logging User In');
            // run signInWithEmailAndPassword
            firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                // Empty out the input values
                $('#signInForm .email').val('')
                $('#signInForm .password').val('')
                // redirect_to index
                window.location.replace('index.html');
            }).catch((error) => {
                console.log(error.code);
                console.log(error.message);
            })
        }    
    })

    // =======  USER UPDATE PROFILE LISTENER ======= //
    // When user clicks the Update Profile button
    $('#profile').on('click', '#editProfile', () => {
        console.log('Ready to update');
        // Add a file upload input to the photoUrl
        //$('#current_user_profile .photoUrl').after('<input class="photoInput form-control mr-sm-2"  type="file" placeholder="">') 
        // Add a text input form to the name
        $('#profile .name').after('<input class="nameInput form-control"  type="text" placeholder="Enter name here">') 
        // Add a Save profile button
        $('#profile #editProfile').after('<a href="#" id="saveProfile" class="">Save Profile</a>')
        // Remove the edit profile button
        $('#profile #editProfile').remove()

        // when user clicks the save button 
        $('#profile #saveProfile').on('click', (e) => {
            e.preventDefault()
            // get values from input fields
            //var photoURL = $('#current_user_profile .photoInput').val().trim() // photo input
            var name = $('#profile .nameInput').val().trim() // name input
            //console.log(photoURL);
            console.log(name);
            
            // ref to firebase.auth().currentUser
            var user = firebase.auth().currentUser
            // save the input values to their respective fields
            user.updateProfile({
                displayName: name,
            // photoURL: photoURL
            }).then(() => {
                // Update successful.
                console.log('Profile saved');
                //reload the page
                location.reload()
            }).catch((error) => {
                // An error happened.
                console.log(error.code)
                console.log(error.message)
            })
            // TODO: ALLOW USERS TO UPLOAD PROFILE IMG
        })
    })

    // =======  USER LOGOUT LISTENER ======= //
    // When user clicks the logout button
    $('nav').on('click', '.logOut', () => {
        // User signed out
        console.log('User signed out');
        // redirect back to login
        firebase.auth().signOut().then(() => {
            // run auth signOut method
            window.location.replace('index.html');
        }).catch((error) => {
            console.log(error.code);
            console.log(error.message);      
        })
    })