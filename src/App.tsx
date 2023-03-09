import {Decimal} from 'decimal.js';
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

  const [entry, setEntry] = useState(new Decimal(0));
  const [tp, setTp] = useState(new Decimal(0));
  const [sl, setSl] = useState(new Decimal(0));
  const [limit1, setLimit1] = useState(new Decimal(0));
  const [limit2, setLimit2] = useState(new Decimal(0));

  const [accountSize, setAccountSize] = useState(1000);

  const riskInputId = useId();
  const [risk, setRisk] = useState(3);

  const [prices, priceOptions, setPrices] = usePriceOptions();

  return (
    <div className="center intristic align">
      <div className="cover nopad">
        <h1>Compounding lot size calculator</h1>
        <form className="inner">
          <div className="with-sidebar">
            <div className="stack">

            {prices.length > 0 && (
                <>
                  <div className="form-group">
                    <label htmlFor="{entrySelectId}">Entry price</label>

                    <select
                      className="input-control"
                      id="{entrySelectId}"
                      name="entry"
                      onChange={(e) => setEntry(new Decimal(e.target.value))}
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{slSelectId}">Stop-loss price</label>

                    <select
                      className="input-control"
                      id="{slSelectId}"
                      name="sl"
                      onChange={(e) => setSl(new Decimal(e.target.value))}
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{tpSelectId}">Take profit price</label>

                    <select
                      className="input-control"
                      id="{tpSelectId}"
                      name="tp"
                      onChange={(e) => setTp(new Decimal(e.target.value))}
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="{limit1SelectId}">Limit 1 price</label>

                    <select
                      className="input-control"
                      id="{limit1SelectId}"
                      name="l1"
                      onChange={(e) => setLimit1(new Decimal(e.target.value))}
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
                      onChange={(e) => setLimit2(new Decimal(e.target.value))}
                    >
                      {priceOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <button type="button">Submit</button>
                  </div>
                </>
              )}
            </div>
            <div>
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
                  className="input-control tip"
                  id={tipTextAreaId}
                  name="tip"
                  onChange={(e) => setPrices(e.target.value)}
                />
              </div>

              { !entry.isZero()&&!sl.isZero()&&!limit1.isZero()&&!limit2.isZero()&& <p>All set</p>}

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;