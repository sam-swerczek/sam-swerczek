function App() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Hello from React!</h1>
            <p>This is a simple React app to test git connectivity.</p>
            <button onClick={() => alert('Button clicked!')}>
                Click me
            </button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
