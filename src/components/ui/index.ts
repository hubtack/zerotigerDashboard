import { defineComponent, h } from 'vue'

// Aurora Background Component
export const AuroraBackground = defineComponent({
  name: 'AuroraBackground',
  setup() {
    return () => h('div', {
      class: 'aurora-bg'
    })
  }
})

// Radiant Text Component
export const RadiantText = defineComponent({
  name: 'RadiantText',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    return () => h('span', {
      class: 'radiant-text'
    }, slots.default?.() || props.text)
  }
})

// Card Spotlight Component
export const CardSpotlight = defineComponent({
  name: 'CardSpotlight',
  setup(_, { slots }) {
    return () => h('div', {
      class: 'card-spotlight'
    }, slots.default?.())
  }
})

// Glow Border Component
export const GlowBorder = defineComponent({
  name: 'GlowBorder',
  props: {
    color: {
      type: String,
      default: '#42b983'
    }
  },
  setup(props, { slots }) {
    return () => h('div', {
      class: 'glow-border',
      style: {
        '--glow-color': props.color
      }
    }, slots.default?.())
  }
})

// Animated Tooltip Component
export const AnimatedTooltip = defineComponent({
  name: 'AnimatedTooltip',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props, { slots }) {
    return () => h('div', {
      class: 'tooltip',
      'data-tooltip': props.content
    }, slots.default?.())
  }
})

// Gradient Button Component
export const GradientButton = defineComponent({
  name: 'GradientButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots, attrs }) {
    return () => h('button', {
      class: 'gradient-button',
      disabled: props.disabled,
      ...attrs
    }, slots.default?.())
  }
})

// Multi Step Loader Component
export const MultiStepLoader = defineComponent({
  name: 'MultiStepLoader',
  setup() {
    return () => h('div', {
      class: 'multi-step-loader'
    }, [
      h('div', { class: 'step' }),
      h('div', { class: 'step' }),
      h('div', { class: 'step' })
    ])
  }
}) 