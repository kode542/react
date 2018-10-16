var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {

	return(
  	<div className="col-5">
  	  {_.range(props.numberOfStars).map(i =>
      	<i key={i} className="fa fa-star"></i>
      )}
  	</div>
  );
}

const Button = (props) => {
	let button, redraw;
  
  switch(props.answerIsCorrect){
  	case true:
    	button =
          <button className="btn btn-success" 
          				disabled={props.selectedNumbers.length === 0}
                  onClick={props.acceptAnswer}>
            <i className="fa fa-check"></i>
          </button>
    	break;
    case false:
    	button =
          <button className="btn btn-danger" 
          				disabled={props.selectedNumbers.length === 0}>
            <i className="fa fa-times"></i>
          </button>
    	break;
    default:
      button =
          <button className="btn" 
          				onClick={props.checkAnswer}
          				disabled={props.selectedNumbers.length === 0}>
            =
          </button>
    	break;
  }
  
	return(
  	<div className="col-2 text-center">
    	{button}
      <br/> <br/>
      <button className="btn btn-warning btn-sm"
      				onClick={props.redraw}
              disabled={props.redraws === 0}>
        <i className="fas fa-sync-alt" style={{color: 'white', letterSpacing: 5}}>{props.redraws}</i>
      </button>
		</div>
  );
}

const Answer = (props) => {
	return(
  	<div className="col-5">
  		{props.selectedNumbers.map((number, i) =>
      	<span onClick={() => props.deselectNumber(number)} key={i}>{number}</span>
      )}
  	</div>
  );
}

const Numbers = (props) => {
	const numberClassName = (number) => {
  	if(props.usedNumbers.indexOf(number) >= 0){
    	return 'used';
    }
  	if(props.selectedNumbers.indexOf(number) >= 0){
    	return 'selected';
    }
  }

	return(
  	<div className="card text-center">
  	  <div>
  	    {Numbers.list.map((number, i) =>
        	<span onClick={() => props.selectNumber(number)} key={i} className={numberClassName(number)}>{number}</span>
        )}
        
  	  </div>
  	</div>
  );
}

const DoneFrame = (props) => {
	return(
  	<div className="text-center">
  	  <h2>{props.doneStatus}</h2>
      <br/>
      <button className="btn btn-primary"
      				onClick={props.resetGame}>
        Play Again
      </button>
  	</div>
  );
}

Numbers.list = _.range(1, 10);

class Game extends React.Component {
	static randomNumber = () => 1 + Math.floor(Math.random()* 9);
	static initialState = () => ({
  	selectedNumbers: [],
    randomNumberOfStars: 1 + Game.randomNumber(),
    usedNumbers: [],
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null,
  });
  state = Game.initialState();
  resetGame = () => this.setState(Game.initialState());
	selectNumber = (clickedNumber) => {
  	if(this.state.usedNumbers.indexOf(clickedNumber)  >= 0){return;}
    if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0){return;}
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };
  deselectNumber = (clickedNumber) => {
  	this.setState(prevState => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
    }));
  };
  checkAnswer = () => {
  	this.setState(prevState => ({
    	answerIsCorrect: prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };
  acceptAnswer = () => {
  	this.setState(prevState => ({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      randomNumberOfStars: 1 + Game.randomNumber(),
      answerIsCorrect: null
    }), this.updateDoneStatus);
  };
  redraw = () => {
  	this.setState(prevState => ({
    	randomNumberOfStars: 1 + Game.randomNumber(),
      redraws: prevState.redraws - 1,
    }), this.updateDoneStatus);
  };
  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1, 10).filter(number => 
    	usedNumbers.indexOf(number) === -1
    );
    
    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  }
  updateDoneStatus = () => {
  	this.setState(prevState => {
    	if(prevState.usedNumbers.length === 9){
      	return {doneStatus: 'Well done!'}
      }
      if(prevState.redraws === 0 && !this.possibleSolutions(prevState)){
      	return {doneStatus: 'Game Over!'}
      }
    });
  };
  
	render(){
  	const { 
    	randomNumberOfStars, 
      selectedNumbers, 
      answerIsCorrect,
      usedNumbers,
      redraws,
      doneStatus
    } = this.state
    
  	return(
    	<div className="container">
      	<h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars}/>
        	<Button selectedNumbers={selectedNumbers}
          				checkAnswer={this.checkAnswer}
                  answerIsCorrect={answerIsCorrect}
                  acceptAnswer={this.acceptAnswer}
                  redraws={redraws}
                  redraw={this.redraw}/>
        	<Answer deselectNumber={this.deselectNumber}
          				selectedNumbers={selectedNumbers}/>
        </div>
        <br />
        {doneStatus ? 
        <DoneFrame doneStatus={doneStatus}
        					 resetGame={this.resetGame}/> :
        <Numbers selectedNumbers={selectedNumbers}
        				 selectNumber={this.selectNumber}
                 usedNumbers={usedNumbers}/>
        }
      </div>
    );
  }
}

class App extends React.Component {
	render(){
  	return(
    	<div>
    	  <Game />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode)