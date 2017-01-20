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
					<p>You make {this.props.amount}</p>
					Hourly Rate:  
					<input 
						value={this.state.term}
						onChange={event => this.onInputChange(event.target.value)}
					/>
					Salary:
					<input />
					Number of allowances: 
					<input type='number' /> 
					Pay Frequency: 
					<select>
						<option>Weekly</option>
						<option>Bi-weekly</option>  
						<option>Bi-monthly</option>
						<option>Monthly</option>  
					</select>
					<button>Submit</button>
				</form>
				
			</div>
		)
	}
}

export default SalaryInput; 