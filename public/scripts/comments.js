// tutorial1.js
var CommentBox = React.createClass({
	loadCommentsFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({entries:data.entries, total:data.counter, title:data.entries[0].title, link:data.entries[0].link});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {entries: [], total: 0, title: '', link: ''};
	},
	componentDidMount: function(){
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			<div className="commentBox">
				<h1><a href={this.state.link}>{this.state.title}</a></h1>
				<h2>{this.state.total} Comments</h2>
				<CommentList data={this.state.entries} />
				<CommentForm />
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment){
			return (
				<Comment key={comment.com_id} data={comment}>
					{comment.cmt_text}
				</Comment>
			);
		});

		return (
			<ul className="comment_list media-list">
				{commentNodes}
			</ul>
		);
	}
});

var CommentForm = React.createClass({
	render: function() {
		return (
			<div className="commentForm">
				<form method="post" action="">

				</form>
			</div>
		);
	}
});

var Comment = React.createClass({
	rawMarkup: function() {
		var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
		return { __html : rawMarkup };
	},
	render: function() {
		var twlink = "https://twitter.com/intent/tweet?url=" + this.props.data.link;
		return (
			<li className="list_dk media">
				<span className="user_pic pull-left">
					<img src={this.props.data.prf_avatar} />
				</span>
				<div className="list_dk_text media-body mb_parent" id={this.props.key}>
					<span className="dk_name controls controls-row">
						<b>{this.props.data.prf_name} </b>
					</span>
					<span className="dk_name dk_user">@{this.props.data.prf_user}</span> &middot; <span className="dk_date">11 menit yang lalu</span>
					<div className="dk_komen" dangerouslySetInnerHTML={this.rawMarkup()} />
					<input className="parent_id" type="hidden" value={this.props.key} />
					<div className="dk_action reaction">
						<a className="dk_balas">
							<span className="count">0</span><span>Balas</span>
						</a>
						<a className="dk_fav">
							<span className="count">0</span><span>Favorit</span>
						</a>
						<a className="to_share">
							<span>Share</span>
							<span className="share_elm">
								<a className="selm se_fb"></a> 
								<a className="selm se_tw" href={twlink} target="__blank"> </a>
							</span>
						</a>
						<a className="dk_flag">
							<span>Laporkan</span>
						</a>
						<div className="clearfix"></div>
					</div>
				</div>
				<div className="clearfix"></div>
			</li>
		);
	}
});

ReactDOM.render(
	<CommentBox url='/api/comments/3111545/10' pollInterval={2000} />,
	document.getElementById('content')
);