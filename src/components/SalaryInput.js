import React, {Component} from 'react'; 

class SalaryInput extends Component {
	constructor(props){
		super(props); 
		this.state = {term: ''}; 
	}
	onInputChange(term){
		this.setState({term}); 
		this.props.onSearchTermchange(term); 
	}
	render(){
		return (
			<div>
				<form>
					Hourly Rate:  
					<input 
						value={this.state.term}
						onChange={event => this.onInputChange(event.target.value)}
					/>
					Salary:
					<input />
					<button>Submit</button>
				</form>
				
			</div>
		)
	}
}

export default SalaryInput; 