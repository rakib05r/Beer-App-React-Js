import React, {Component} from 'react'
import {Link} from "react-router-dom";
import axios from 'axios'
import './css/fetchdata.css'
class FetchData extends Component {

	setCookie(cname, cvalue, exdays) {
	  var d = new Date();
	  d.setTime(d.getTime() + (exdays*24*60*60*1000));
	  var expires = "expires="+ d.toUTCString();
	  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	getCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) === ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) === 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}
	favouriteClick(id) {
		//var cookieParseValue=JSON.parse(this.getCookie('my'));
		// if(cookieParseValue.length!=0){
		// 	cookieParseValue.push(id);
		// 	var stringyfyValue=JSON.stringify(cookieParseValue);
		// 	this.setCookie('my',stringyfyValue,10);
		// }
		// else{
		// 	var cookieValueArray=[];
		// 	cookieValueArray.push(id);
		// 	var stringyfyValue=JSON.stringify(cookieParseValue);
		// 	this.setCookie('my',stringyfyValue,10);
		// }
		//var stringyfyValue=this.getCookie('my')+id;
		this.setCookie('my',id,10);
		console.log('Cookie Value: ' + this.getCookie('my'));
		if(document.getElementById(id).classList.contains("star-active")){
			document.getElementById(id).classList.remove("star-active");
		}else{
			document.getElementById(id).classList.add("star-active");
		}
  }
	constructor (props){
		super(props)

		this.state={
			searchString: "",
			posts:[],
			per:12,
			page:1
		};
		this.handleChange = this.handleChange.bind(this);
	}
	componentWillMount(){
		this.fetchData();
		window.addEventListener('scroll',(e)=>{
			this.handleScroll(e);
		})
	}

	handleScroll =(e) =>{
		if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        this.loadMore();
      }
	}

	fetchData =()=>{
		const {per,page,posts} = this.state
		const apiUrl=`https://api.punkapi.com/v2/beers?page=${page}&per_page=${per}`
		axios.get(apiUrl)
		.then(response =>{
			this.setState({
				posts:[...posts,...response.data],
				scrolling:false
			});
			this.refs.search.focus();
		} )
		.catch(error =>{
			console.log(error);
		})
	}

	loadMore =()=>{
		this.setState(prevState=>({
			page:prevState.page + 1,
			scrolling:true
		}),this.fetchData)
	}

	handleChange=()=> {
    this.setState({
      searchString: this.refs.search.value
    });
  }
	render() {
		let posts = this.state.posts;
    	let search = this.state.searchString.trim().toLowerCase();
    	if (search.length > 0) {
      		posts = posts.filter(function(post) {
        	return post.name.toLowerCase().match(search);
      	});
    	}
		return (
			<React.Fragment>
			<nav className="navbar navbar-expand-sm bg-primary-color navbar-dark px-sm-5">
				<div className="nav-middle text-center ml-auto">
					<h1>The Beer Bank</h1>
					<p>Find Your Favourite Beer Here</p>
					<input type="text" value={this.state.searchString} ref="search" onChange={this.handleChange} placeholder="Search for Beer Name" />
				</div>
				<ul className="ml-auto">
					<li>
						<Link to="/">                                                                                                                                                                                
							HOME
						</Link>
					</li>
					<li>
						<Link to="/favourite">
							FAVOURITE
						</Link>
					</li>
				</ul>
			</nav>
			<div className="container">
				<div className="row">
						{
							posts.map(post =>
									<div className="col-9 mx-auto col-md-6 col-lg-4 my-3" key={post.id}>
										<div className="card" >
											<i onClick={()=>this.favouriteClick(post.id)} id={post.id} className="fa fa-star star-font"></i>
											<div className="img-container p-3 text-center" data-toggle="modal" data-target={"#modal-" + post.id}>
												<img src={post.image_url} width="90px" height="275px" alt="Beer" />
											</div>
											<h6 className="beer-name text-center">{post.name}</h6>
											<h6 className="text-center">{post.tagline}</h6>
										</div>
										<div className="modal fade" id={"modal-" + post.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
  											<div class="modal-dialog" role="document">
    											<div className="modal-content">
      												<div className="modal-headerr">
        												<button type="button" className="close" data-dismiss="modal" aria-label="Close">
          													<span aria-hidden="true">&times;</span>
        												</button>
      												</div>
      												<div className="modal-body">
      													<div className="container">
      														<div className="row">
      															<div className="col-12 col-lg-4 col-md-4 col-xl-4 col-sm-4 img-center">
      																<img src={post.image_url} width="110px" height="350px" alt="Beer" />
      															</div>
      															<div className="col-12 col-lg-8 col-md-8 col-xl-8 col-sm-8 p-6">
      																<h6 className="modal-beer-name">{post.name}</h6>
      																<h6>{post.tagline}</h6>
      																<div className="beer-description-part">
      																	<div className="beer-ibu">
      																		<div>
      																			<b>IBU: </b>{post.ibu}
      																		</div>
      																		<div>
      																			<b>ABV: </b>{post.abv}
      																		</div>
      																		<div>
      																			<b>EBC: </b>{post.ebc}
      																		</div>
      																	</div>
      																	<div className="beer-description">
      																		<p>{post.description}</p>
      																	</div>
      																	<div className="served">
      																		Best Served With:
      																		<ol>
      																			{/*<li{for(var i=0;i<post.food_pairing.length;i++)}>{post.food_pairing[i]}</li>*/}
      																			{
      																				post.food_pairing.map((value,index) =>
      																					<li key={index}>{value}</li>
      																					)
      																			}
      																		</ol>
      																	</div>
      																</div>
      															</div>
      														</div>
      													</div>
      													{/*
      													<div className="modal-bottom-part">
      														<h6>You might also like:</h6>
      															<div className="container">
      																<div className="row">
      																	<div className="col-4 col-md-4 col-lg-4 my-3">
      																		<div className="card">
      																			<div className="img-container p-3 text-center">
																					<img src={post.image_url} width="100px" height="350px" alt="Beer Image" />
																					<h6 className="beer-name text-center">{post.name}</h6>
																				</div>
      																		</div>
      																	</div>
      																</div>
      															</div>
      													</div> */}
      												</div>
    											</div>
  											</div>
										</div>
									</div>
								)
						}
				</div>
			</div>
			</React.Fragment>
		)
	}
}
export default FetchData