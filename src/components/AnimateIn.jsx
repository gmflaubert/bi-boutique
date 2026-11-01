import { useInView } from '../hooks/useInView'

export default function AnimateIn({ children, className = '', animation = 'anim-fade-up', delay = 0, style = {} }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`${animation} ${inView ? 'in-view' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}
