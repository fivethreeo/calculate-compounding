import { Decimal } from "decimal.js";
import { useReducer, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { useId, useCallback } from "react";
const pricesRe = /(\d{4}(\.\d?\d)?)/g;
const buySellRe = /sell/gi;
/*
function usePriceOptions(): [string[], JSX.Element, (value: string) => void] {
  const [prices, setPrices] = useState<string[]>([]);
  const setPricesFromValue = useCallback((value: string): void => {
    setPrices(Array.from(value.matchAll(pricesRe)).map((match) => match[0]));
  }, []);

  return [prices, setPricesFromValue];
}
*/
type tipPrices = {
  [key in "entry" | "stopLoss" | "takeProfit" | "order1" | "order2"]: Decimal;
};

type appState = {
  accountSize: Decimal;
  risk: number;
  lotSize: number,
  prices: tipPrices;
  positionType: string;
  pricesSet: boolean;
};

type appAction = {
  type: string;
  payload: string;
};

const appReducer = (state: appState, action: appAction): appState => {
  switch (true) {
    case ["entry", "stopLoss", "takeProfit", "order1", "order2"].includes(
      action.type
    ):
      const newPrices = {
        ...state.prices,
        [action.type]: new Decimal(action.payload),
      };
      return {
        ...state,
        prices: newPrices,
        pricesSet: Object.values(newPrices).every((value) => !value.isZero()),
      };
    case action.type == "accountSize":
      return { ...state, accountSize: new Decimal(action.payload) };
    case action.type == "risk":
      return { ...state, risk: parseInt(action.payload) };
    case action.type == "parseTip":
      const positionType = buySellRe.test(action.payload) ? "SELL" : "BUY";
      
      const prices = Array.from(action.payload.matchAll(pricesRe))
        .map((v) => new Decimal(v[0]))
        .sort((a, b) => (a.lessThan(b) ? 1 : -1));
      console.log(prices.map((p) => p.toString()));
      if (prices.length > 2) {
        const newPrices = {
          entry: positionType == "BUY" ? prices[1] : prices[prices.length-2],
          stopLoss:
            positionType == "BUY"
              ? prices[prices.length-1]
              : prices[0],
          takeProfit:
            positionType == "BUY"
              ? prices[0]
              : prices[prices.length - 1],
          order1: positionType == "BUY" ? prices[2] : prices[2],
          order2: positionType == "BUY" ? prices[3] : prices[1],
        };

        return { ...state, positionType, prices: newPrices };
      }
      case action.type == "positionType":
        return { ...state, positionType: action.payload };
      case action.type == "lotSize":
        return { ...state, lotSize: parseInt(action.payload) };


  }
  return state;
};

function App() {
  const accountSizeId = useId();
  const lotSizeId = useId();
  const tipTextAreaId = useId();
  const positionTypeSelectId = useId();
  const entrySelectId = useId();
  const tpSelectId = useId();
  const slSelectId = useId();
  const limit1SelectId = useId();
  const limit2SelectId = useId();

  const [state, dispatch] = useReducer(appReducer, {
    accountSize: new Decimal(0),
    risk: 3,
    lotSize: 100,
    prices: {
      entry: new Decimal(0),
      stopLoss: new Decimal(0),
      takeProfit: new Decimal(0),
      order1: new Decimal(0),
      order2: new Decimal(0),
    },
    positionType: "BUY",
    pricesSet: false,
  });
  const [accountSize, setAccountSize] = useState(1000);

  const riskInputId = useId();
  const [risk, setRisk] = useState(3);

  const priceOptions = (
    <>
      {Object.values(state.prices).map((object, i) => (
        <option value={object.toString()} key={i}>
          {object.toString()}
        </option>
      ))}
    </>
  );
  return (
    <div className="center intristic">
      <div className="cover nopad">
        <h1>Compounding lot size calculator</h1>
        <form className="inner">
          <div className="with-sidebar">
            <div className="stack">
              {
                <>
                  <div className="form-group">
                    <label htmlFor="{positionTypeSelectId}">
                      Position type
                    </label>

                    <select
                      className="input-control"
                      id="{positionTypeSelectId}"
                      name="entry"
                      value={state.positionType}
                      onChange={(e) =>
                        dispatch({
                          type: "positionType",
                          payload: e.target.value,
                        })
                      }
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{entrySelectId1}">Entry price</label>

                    <input
                      className="input-control smallinput"
                      id="{entrySelectId}1"
                      value={state.prices.entry.toString()}
                      onChange={(e) =>
                        dispatch({ type: "entry", payload: e.target.value })
                      }
                    />
                    <select
                      className="input-control"
                      id="{entrySelectId}2"
                      name="entry"
                      value={state.prices.entry.toString()}
                      onChange={(e) =>
                        dispatch({ type: "entry", payload: e.target.value })
                      }
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{slSelectId}1">Stop-loss price</label>

                    <input
                      className="input-control smallinput"
                      id="{slSelectId}1"
                      name="sl"
                      value={state.prices.stopLoss.toString()}
                      onChange={(e) =>
                        dispatch({ type: "stopLoss", payload: e.target.value })
                      }
                    />
                    <select
                      className="input-control"
                      id="{slSelectId}2"
                      name="sl"
                      value={state.prices.stopLoss.toString()}
                      onChange={(e) =>
                        dispatch({ type: "stopLoss", payload: e.target.value })
                      }
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{tpSelectId}1">Take profit price</label>

                    <input
                      className="input-control smallinput"
                      id="{tpSelectId}1"
                      name="tp"
                      value={state.prices.takeProfit.toString()}
                      onChange={(e) =>
                        dispatch({
                          type: "takeProfit",
                          payload: e.target.value,
                        })
                      }
                    />
                    <select
                      className="input-control"
                      id="{tpSelectId}2"
                      name="tp"
                      value={state.prices.takeProfit.toString()}
                      onChange={(e) =>
                        dispatch({
                          type: "takeProfit",
                          payload: e.target.value,
                        })
                      }
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{limit1SelectId}1">Limit 1 price</label>

                    <input
                      className="input-control smallinput"
                      id="{limit1SelectId}1"
                      name="l1"
                      value={state.prices.order1.toString()}
                      onChange={(e) =>
                        dispatch({ type: "order1", payload: e.target.value })
                      }
                    />
                    <select
                      className="input-control"
                      id="{limit1SelectId}2"
                      name="l1"
                      value={state.prices.order1.toString()}
                      onChange={(e) =>
                        dispatch({ type: "order1", payload: e.target.value })
                      }
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{limit2SelectId}1">Limit 2 price</label>

                    <input
                      className="input-control smallinput"
                      id="{limit2SelectId}1"
                      name="l2"
                      value={state.prices.order2.toString()}
                      onChange={(e) =>
                        dispatch({ type: "order2", payload: e.target.value })
                      }
                    />
                    <select
                      className="input-control"
                      id="{limit2SelectId}2"
                      name="l2"
                      value={state.prices.order2.toString()}
                      onChange={(e) =>
                        dispatch({ type: "order2", payload: e.target.value })
                      }
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <button type="button">Submit</button>
                  </div>
                </>
              }
            </div>
            <div>
              <div className="form-group">
                <label htmlFor={riskInputId}>Risk:</label>
                <input
                  defaultValue={risk}
                  className="input-control smallinput"
                  id={riskInputId}
                  name="risk"
                  onChange={(e) =>
                    dispatch({ type: "risk", payload: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={accountSizeId}>Account size (USD):</label>
                <input
                  defaultValue={accountSize}
                  className="input-control smallinput"
                  id={accountSizeId}
                  name="as"
                  onChange={(e) =>
                    dispatch({ type: "accountSize", payload: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={lotSizeId}>Lot size:</label>
                <input
                  value={state.lotSize}
                  className="input-control smallinput"
                  id={lotSizeId}
                  name="as"
                  onChange={(e) =>
                    dispatch({ type: "lotSize", payload: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor={tipTextAreaId}>Paste tip here:</label>
                <textarea
                  className="input-control tip"
                  id={tipTextAreaId}
                  name="tip"
                  onChange={(e) =>
                    dispatch({ type: "parseTip", payload: e.target.value })
                  }
                />
              </div>

              {state.pricesSet && <p>All set</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
