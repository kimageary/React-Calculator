import { useReducer } from "react";
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton";
import "./styles.css"  

// Here we are declaring five different constant variables
// that will be each of the actions that we need to 
// write logic for.
// This is done so that it makes the code easier to read in the future.
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

// This is writing out a reducer function which will help with modifying
// the state based on the different actions
function reducer(state, {type, payload}){
  // this is the start of a switch statement that has cases that correspond
  // to each action that is associated with each button
  switch(type){
    case ACTIONS.ADD_DIGIT:
      // checks to see if the overwrite flag is set to true 
      if(state.overwrite){
        // returns the state, and sets the current operand to the digit that was pushed, and sets overwrite to false
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      // checks to see if the digit pressed is 0 and if the current operand is 0
      if(payload.digit === "0" && state.currentOperand === "0") return state
      // checks to see if the digit pressed is . and if the current operand is .
      if(payload.digit === "." && state.currentOperand.includes(".")) return state
      if(payload.digit === "." && state.currentOperand ==null) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

      // this clears everything and returns an empty state
    case ACTIONS.CLEAR:{
      return {}
    }
    // this case handles the choosing of an operation
    case ACTIONS.CHOOSE_OPERATION:{
      // checks to see if the current and previous operands are null prevents an operand from getting picked if there are no other
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if(state.currentOperand == null){
        return {
        ...state,
        operation: payload.operation,
        }
      }
      if (state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return{
        ...state,
        overwrite: true,
        previousOperand: evaluate(state),
        operation:payload.operation,
        currentOperand: null
      }
    }
    case ACTIONS.EVALUATE:
      if(state.operation == null || 
        state.currentOperand == null ||
        state.previousOperand == null)
        {return state}
      
      return{
        ...state,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    case ACTIONS.DELETE_DIGIT:{
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1){
        return {
          ...state,
          currentOperand: null,
        }
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    }
  }
}

function evaluate({ currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "÷":
      computation = prev / current
      break
      case "*":
      computation = prev * current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0,
} )

function formatOperand(operand){
  if(operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const[{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})


  return (
      <div className ="calculator-grid">
          <div className="output">
            <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
            <div className="current-operand">{formatOperand(currentOperand)}</div>
          </div>
          <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })} >AC</button>
          <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
          <OperationButton operation="÷" dispatch={dispatch} />
          <DigitButton digit="1" dispatch={dispatch} />
          <DigitButton digit="2" dispatch={dispatch} />
          <DigitButton digit="3" dispatch={dispatch} />
          <OperationButton operation="*" dispatch={dispatch} />
          <DigitButton digit="4" dispatch={dispatch} />
          <DigitButton digit="5" dispatch={dispatch} />
          <DigitButton digit="6" dispatch={dispatch} />
          <OperationButton operation="+" dispatch={dispatch} />
          <DigitButton digit="7" dispatch={dispatch} />
          <DigitButton digit="8" dispatch={dispatch} />
          <DigitButton digit="9" dispatch={dispatch} />
          <OperationButton operation="-" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <DigitButton digit="0" dispatch={dispatch} />
          <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
  )
}

export default App;