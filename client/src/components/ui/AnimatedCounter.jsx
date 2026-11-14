import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedCounter - Smooth, spring-animated numeric display for cyber telemetry and entropy metrics.
 *
 * @param {Object} props
 * @param {number} props.value - Target numeric value
 * @param {string} [props.prefix=''] - Leading character (e.g. "~", "$")
 * @param {string} [props.suffix=''] - Trailing character (e.g. " bits", " yrs", "%")
 * @param {number} [props.decimals=0] - Decimal places
 * @param {string} [props.className='']
 */
export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  });

  const [output, setOutput] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setOutput(latest);
    });
  }, [display]);

  return (
    <motion.span className={`font-mono font-bold tracking-tight ${className}`}>
      {output}
    </motion.span>
  );
}
