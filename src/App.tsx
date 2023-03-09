import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useId, useCallback } from "react";
const pricesRe = /(\d{4}(\.\d?\d)?)/g;
function usePriceOptions(): [string[], JSX.Element, (value: string) => void] {
  const [prices, setPrices] = useState<string[]>([]);
  const setPricesFromValue = useCallback((value: string): void => {
    setPrices(Array.from(value.matchAll(pricesRe)).map((match) => match[0]));
  }, []);

  return [
    prices,
    <>
      <option value=""></option>
      {prices.map((object, i) => (
        <option value={object} key={i}>
          {object}
        </option>
      ))}
    </>,
    setPricesFromValue,
  ];
}

function App() {
  const accountSizeId = useId();

  const tipTextAreaId = useId();
  const entrySelectId = useId();
  const tpSelectId = useId();
  const slSelectId = useId();
  const limit1SelectId = useId();
  const limit2SelectId = useId();

  const [accountSize, setAccountSize] = useState(1000);

  const riskInputId = useId();
  const [risk, setRisk] = useState(3);

  const [prices, priceOptions, setPrices] = usePriceOptions();

  return (
    <div className="center intristic align">
      <div className="cover nopad">
        <h1>Compounding lot size calculator</h1>
        <form className="inner stack">
          <div className="form-group">
            <label htmlFor={riskInputId}>Risk:</label>
            <input
              defaultValue={risk}
              className="input-control"
              id={riskInputId}
              name="risk"
              onChange={(e) => setRisk(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor={accountSizeId}>Account size (USD):</label>
            <input
              defaultValue={accountSize}
              className="input-control"
              id={accountSizeId}
              name="as"
              onChange={(e) => setAccountSize(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor={tipTextAreaId}>Paste tip here:</label>
            <textarea
              className="input-control"
              id={tipTextAreaId}
              name="tip"
              onChange={(e) => setPrices(e.target.value)}
            />
          </div>
          {prices.length > 0 && (
            <>
              <div className="form-group">
                <label htmlFor="{entrySelectId}">Entry price</label>

                <select
                  className="input-control"
                  id="{entrySelectId}"
                  name="entry"
                >
                  {priceOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="{slSelectId}">Stop-loss price</label>

                <select className="input-control" id="{slSelectId}" name="sl">
                  {priceOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="{tpSelectId}">Take profit price</label>

                <select className="input-control" id="{tpSelectId}" name="tp">
                  {priceOptions}
                </select>
              </div>
              v
              <div className="form-group">
                <label htmlFor="{limit1SelectId}">Limit 1 price</label>

                <select
                  className="input-control"
                  id="{limit1SelectId}"
                  name="l1"
                >
                  {priceOptions}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="{limit2SelectId}">Limit 2 price</label>

                <select
                  className="input-control"
                  id="{limit2SelectId}"
                  name="l2"
                >
                  {priceOptions}
                </select>
              </div>
              <div className="form-group">
                <button type="button">Submit</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
