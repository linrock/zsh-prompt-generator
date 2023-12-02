import { useRef, useState } from 'react';
import { COLORS } from './colors';

function sixSquares() {
  const squares = [[], [], [], [], [], []]
  let j = 0
  for (let i = 0; i < 216; i++) {
    if (i > 0 && i % 6 === 0) {
      j = (j + 1) % 6
    }
    squares[j].push(16 + i)
  }
  return squares
}


const TputColor = ({ code }) => <>\[$(tput setaf <span className="color-code">{code}</span>)\]</>;
const TputReset = () => <>\[$(tput sgr0)\]</>;

const AnsiColor = ({ code }) => <>\[\e[38;5;<span className="color-code">{code}</span>m\]</>;
const AnsiReset = () => <>\[\033[0m\]</>;

const ZshPromptExample = ({ name, colors }) => {
  const [shouldShowPs1, setShouldShowPs1] = useState(false);
  return <>
    <div className="prompt-preview-and-name">
      <code className="prompt-preview prompt-preview-example"
            onClick={() => {
              setShouldShowPs1(!shouldShowPs1);
            }}>
        <span style={{ color: COLORS[colors[0]] }}>user</span>
        <span style={{ color: COLORS[colors[1]] }}>@</span>
        <span style={{ color: COLORS[colors[2]] }}>hostname</span>
        &nbsp;
        <span style={{ color: COLORS[colors[3]] }}>~/path/to/directory</span>
        &nbsp;
        <span className="cmd-separator"
        >$</span>
      </code>
      <div className="prompt-theme-name">{name}</div>
    </div>

    <div class="example-ps1-prompts"style={{ display: shouldShowPs1 ? 'block' : 'none' }}>
      <code className="prompt-ps1">
        <span className="export">export </span>
        <span className="ps1-var">PS1</span>=
        <span className="zsh-string">
          "
          <TputColor code={colors[0]} />\u
          <TputColor code={colors[1]} />@
          <TputColor code={colors[2]} />\h <TputColor code={colors[3]} />\w <TputReset />$ "
        </span>
      </code>

      <code className="prompt-ps1">
        <span className="export">export </span>
        <span className="ps1-var">PS1</span>=
        <span className="zsh-string">
          "
          <AnsiColor code={colors[0]} />\u
          <AnsiColor code={colors[1]} />@
          <AnsiColor code={colors[2]} />\h <AnsiColor code={colors[3]} />\w <AnsiReset />$ "
        </span>
      </code>
    </div>
  </>;
}

function ZshPromptGenerator() {
  const [selectedColorInd, setSelectedColorInd] = useState(0);
  const [colors, setColors] = useState([226, 220, 214, 33]);
  const inputsRef = useRef(new Array(colors.length));

  function setColorCodeAt(index, code) {
    const colorsCopy = colors.slice();
    colorsCopy[index] = code;
    setColors(colorsCopy);
  }

  // color squares that can be clicked to set the currently-selected color
  const Square = ({ code }) => (
    <div className="square"
      style={{ background: COLORS[code] }}
      onMouseDown={() => {
        if (selectedColorInd !== null) {
          setColorCodeAt(selectedColorInd, code);
        }
      }}
      onMouseOver={(event) => {
        // if the left mouse button is held down while hovering over the color squares
        if (event.buttons === 1) {
          setColorCodeAt(selectedColorInd, code);
        }
      }}></div>
  );

  // build html for the 256 color squares
  const Squares256 = () => {
    let elements = [];

    // 2 rows of 8 for the first 16 basic colors
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 8; i++) {
        const code = j*8 + i;
        elements.push(<Square code={code} key={code} />);
      }
      elements.push(<div className="clear-left" key={`clear-${j}`}></div>);
    }

    // 6x squares of 6x6 colors each
    elements = elements.concat(sixSquares().map((sixBySix, i) => {
      const squares = [];
      sixBySix.forEach((code) => squares.push(<Square code={code} key={code} />));
      return (<div className="six-by-six" key={`six-by-six-${i}`}>{squares}</div>);
    }));
    elements.push(<div className="clear-left" key={`clear-6x6`}></div>);

    // 2 rows of 12 for the last 24 grayscale colors
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 12; i++) {
        const code = 232 + j*12 + i;
        elements.push(<Square code={code} key={code} />);
      }
      elements.push(<div className="clear-left" key={`clear-${232 + j}`}></div>);
    }
    return <>{elements}</>;
  }

  return (
    <>
      <section className="zsh-prompt-customize">
        <div className="fluid-container">
          <div className="thin-container">
            <code className="prompt-preview">
              <span style={{ color: COLORS[colors[0]] }}
                    onMouseDown={() => setSelectedColorInd(0)}>user</span>
              <span style={{ color: COLORS[colors[1]] }}
                    onMouseDown={() => setSelectedColorInd(1)}>@</span>
              <span style={{ color: COLORS[colors[2]] }}
                    onMouseDown={() => setSelectedColorInd(2)}>hostname</span>
              &nbsp;
              <span style={{ color: COLORS[colors[3]] }}
                    onMouseDown={() => setSelectedColorInd(3)}>~/path/to/directory</span>
              &nbsp;
              <span className="cmd-separator"
              >$</span>
            </code>

            <div className="color-customizer">
              <div className="color-choices">
                {[0, 1, 2, 3].map((ind) => (
                  <div className="color-choice" key={`color-choice-${ind}`}>
                    <div className="color-preview"
                         style={{ background: COLORS[colors[ind]] }}
                         onMouseDown={() => {
                           setTimeout(() => {
                             inputsRef.current[ind].focus();
                             inputsRef.current[ind].select();
                           }, 0);
                           setSelectedColorInd(ind);
                         }}></div>
                    <input type="number" min="0" max="255"
                           ref={el => inputsRef.current[ind] = el}
                           onMouseDown={() => setSelectedColorInd(ind)}
                           value={colors[ind]} onChange={(event) => {
                             const code = Number(event.target.value);
                             if (code >= 0 && code <= 255) {
                               setColorCodeAt(ind, code);
                             }
                           }} />
                    {selectedColorInd === ind && <div className="selection-indicator">↑</div>}
                  </div>
                ))}
              </div>
            </div>

            <code className="prompt-ps1 thin-screen-invis">
              <span className="export">export </span>
              <span className="ps1-var">PS1</span>=
              <span className="zsh-string">
                "
                <TputColor code={colors[0]} />\u
                <TputColor code={colors[1]} />@
                <TputColor code={colors[2]} />\h <TputColor code={colors[3]} />\w <TputReset />$ "
              </span>
            </code>
          </div>

          <div className="colors-256">
            <Squares256 />
          </div>
        </div>
      </section>

      <section className="zsh-prompt-ps1">
        <div className="container">
          <h2>zsh prompt PS1</h2>
          <p>To use the colors you chose, set the PS1 environment variable in your shell:</p>
          <code className="prompt-ps1">
            <span className="export">export </span>
            <span className="ps1-var">PS1</span>=
            <span className="zsh-string">
              "
              <TputColor code={colors[0]} />\u
              <TputColor code={colors[1]} />@
              <TputColor code={colors[2]} />\h <TputColor code={colors[3]} />\w <TputReset />$ "
            </span>
          </code>
          <code className="prompt-ps1-ansi">
            <span className="export">export </span>
            <span className="ps1-var">PS1</span>=
            <span className="zsh-string">
              "
              <AnsiColor code={colors[0]} />\u
              <AnsiColor code={colors[1]} />@
              <AnsiColor code={colors[2]} />\h <AnsiColor code={colors[3]} />\w <AnsiReset />$ "
            </span>
          </code>
          <p>
            It's up to you to decide between tput and ANSI escape sequences.
            To persist your customized prompt, export PS1 in
            ~/.zshrc or ~/.zsh_profile
          </p>
        </div>
      </section>

      <section className="zsh-prompt-examples">
        <div className="container">
          <h2>zsh prompt examples</h2>
          <p style={{ marginBottom: '2rem' }}>
            These are some example color schemes from choosing 4 colors above.
            Click on the zsh prompt previews to view their tput and ANSI PS1 exports.
          </p>

          <ZshPromptExample name="Emerald green"
            colors={[34, 40, 46, 154]} />

          <ZshPromptExample name="Lemon line"
            colors={[47, 156, 227, 231]} />

          <ZshPromptExample name="Fiery orange"
            colors={[196, 202, 208, 220]} />

          <ZshPromptExample name="Autumn leaves"
            colors={[216, 160, 202, 131]} />

          <ZshPromptExample name="Desert sand"
            colors={[216, 220, 222, 229]} />

          <ZshPromptExample name="Ocean blue"
            colors={[39, 45, 51, 195]} />

          <ZshPromptExample name="Blue green yellow"
            colors={[39, 81, 77, 226]} />

          <ZshPromptExample name="Violet pink"
            colors={[165, 171, 213, 219]} />

          <ZshPromptExample name="Monochromatic"
            colors={[243, 245, 249, 254]} />
        </div>
      </section>
    </>
  );
}

export default ZshPromptGenerator;
