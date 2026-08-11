'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import * as Tooltip from '@radix-ui/react-tooltip'
import { checkStages, glossary, type Check } from '@/lib/checks'

function TermTooltip({ term }: { term: string }) {
  const definition = glossary[term]
  if (!definition) return <>{term}</>

  return (
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          className="underline decoration-dotted decoration-text-tertiary underline-offset-2 hover:decoration-primary hover:text-primary transition-colors"
        >
          {term}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="max-w-xs rounded-lg border border-border bg-card px-3 py-2 text-xs text-text-secondary shadow-lg z-50"
        >
          {definition}
          <Tooltip.Arrow className="fill-card" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

function CheckName({ check }: { check: Check }) {
  if (!check.terms?.length) return <>{check.name}</>

  const parts = check.name.split(new RegExp(`(${check.terms.join('|')})`, 'g'))
  return (
    <>
      {parts.map((part, idx) =>
        check.terms!.includes(part) ? (
          <TermTooltip key={idx} term={part} />
        ) : (
          <Fragment key={idx}>{part}</Fragment>
        )
      )}
    </>
  )
}

export default function ChecksBreakdown() {
  return (
    <Tooltip.Provider>
      <section className="py-24 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">The Six Checks</h2>
            <p className="text-xl text-text-secondary max-w-2xl">
              All six run together in a single pass — grouped here by what they check, your node or your
              chain, not by when they run. Hover any underlined term for a plain-language explanation.
            </p>
          </motion.div>

          <Tabs.Root defaultValue={checkStages[0].id} className="bg-card border border-border rounded-xl p-2 sm:p-6">
            <Tabs.List className="flex gap-2 mb-6 border-b border-border" aria-label="Check stage">
              {checkStages.map((stage) => (
                <Tabs.Trigger
                  key={stage.id}
                  value={stage.id}
                  className="px-4 py-3 text-sm font-medium text-text-secondary border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t"
                >
                  {stage.title}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {checkStages.map((stage) => (
              <Tabs.Content key={stage.id} value={stage.id} className="focus-visible:outline-none">
                <p className="text-sm text-text-secondary mb-6">{stage.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stage.checks.map((check) => (
                    <div key={check.id} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-semibold mb-2">
                        <CheckName check={check} />
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{check.description}</p>
                    </div>
                  ))}
                </div>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </section>
    </Tooltip.Provider>
  )
}
