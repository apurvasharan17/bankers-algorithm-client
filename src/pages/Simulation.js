import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Simulation.css';

const Simulation = () => {
  const navigate = useNavigate();

  // State for simulation data
  const [data, setData] = useState(null);
  const [need, setNeed] = useState([]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('simulationData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setData(parsed);
      calculateNeed(parsed);
    }
  }, []);

  // Calculate Need Matrix (Maximum - Allocation)
  const calculateNeed = (simData) => {
    const { processes, resources, allocation, maximum } = simData;
    const needMatrix = [];

    for (let i = 0; i < processes; i++) {
      needMatrix[i] = [];
      for (let j = 0; j < resources; j++) {
        needMatrix[i][j] = maximum[i][j] - allocation[i][j];
      }
    }

    setNeed(needMatrix);
  };

  // Run Safety Algorithm
  const runSafetyAlgorithm = () => {
    if (!data) return;

    setIsRunning(true);
    setResult(null);

    const { processes, resources, allocation, available } = data;

    // Initialize Work and Finish
    const work = [...available];
    const finish = Array(processes).fill(false);
    const safeSequence = [];

    let count = 0;

    while (count < processes) {
      let found = false;

      for (let i = 0; i < processes; i++) {
        if (!finish[i]) {
          // Check if Need[i] <= Work
          let canAllocate = true;
          for (let j = 0; j < resources; j++) {
            if (need[i][j] > work[j]) {
              canAllocate = false;
              break;
            }
          }

          if (canAllocate) {
            // Allocate resources
            for (let j = 0; j < resources; j++) {
              work[j] += allocation[i][j];
            }
            safeSequence.push(i);
            finish[i] = true;
            found = true;
            count++;
          }
        }
      }

      // No process found - unsafe state
      if (!found) {
        setResult({
          isSafe: false,
          safeSequence: [],
          message: 'System is in UNSAFE state. Deadlock may occur!'
        });
        setIsRunning(false);
        return;
      }
    }

    // All processes finished - safe state
    setResult({
      isSafe: true,
      safeSequence,
      message: 'System is in SAFE state.'
    });
    setIsRunning(false);
  };

  // Go back to configure
  const handleReconfigure = () => {
    navigate('/configure');
  };

  // If no data, show message
  if (!data) {
    return (
      <div className="simulation">
        <h1>Simulation</h1>
        <div className="no-data">
          <p>No configuration data found.</p>
          <button onClick={handleReconfigure} className="btn-primary">
            Go to Configure
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="simulation">
      <h1>Simulation</h1>

      <div className="simulation-header">
        <p>Processes: {data.processes} | Resources: {data.resources}</p>
        <button onClick={handleReconfigure} className="btn-secondary">
          Reconfigure
        </button>
      </div>

      {/* Matrices Display */}
      <div className="matrices-grid">
        {/* Allocation Matrix */}
        <div className="matrix-card">
          <h3>Allocation Matrix</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {Array(data.resources).fill(null).map((_, j) => (
                  <th key={j}>R{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.allocation.map((row, i) => (
                <tr key={i}>
                  <td className="row-label">P{i}</td>
                  {row.map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Maximum Matrix */}
        <div className="matrix-card">
          <h3>Maximum Matrix</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {Array(data.resources).fill(null).map((_, j) => (
                  <th key={j}>R{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.maximum.map((row, i) => (
                <tr key={i}>
                  <td className="row-label">P{i}</td>
                  {row.map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Need Matrix */}
        <div className="matrix-card">
          <h3>Need Matrix</h3>
          
          <table>
            <thead>
              <tr>
                <th></th>
                {Array(data.resources).fill(null).map((_, j) => (
                  <th key={j}>R{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {need.map((row, i) => (
                <tr key={i}>
                  <td className="row-label">P{i}</td>
                  {row.map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            
          </table>
          <p className="matrix-formula">Need = Maximum - Allocation</p>
        </div>

        {/* Available Resources */}
        <div className="matrix-card">
          <h3>Available Resources</h3>
          <table>
            <thead>
              <tr>
                {Array(data.resources).fill(null).map((_, j) => (
                  <th key={j}>R{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {data.available.map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Button */}
      <div className="run-section">
        <button 
          onClick={runSafetyAlgorithm} 
          className="btn-run"
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Safety Algorithm'}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className={`result-section ${result.isSafe ? 'safe' : 'unsafe'}`}>
          <h2>{result.isSafe ? 'SAFE STATE' : 'UNSAFE STATE'}</h2>
          <p>{result.message}</p>
          {result.isSafe && (
            <div className="safe-sequence">
              <h3>Safe Sequence:</h3>
              <div className="sequence">
                {result.safeSequence.map((process, index) => (
                  <span key={index} className="process-badge">
                    P{process}
                    {index < result.safeSequence.length - 1 && <span className="arrow">→</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Simulation;