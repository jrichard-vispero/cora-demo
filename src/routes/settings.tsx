import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Card, Checkbox, Select } from '@wrenmoor/ui'
import type { SelectOption } from '@wrenmoor/ui'
import { PageHeader } from '../components/PageHeader'
import { WAREHOUSES, WAREHOUSE_LABELS } from '../data/types'
import type { Warehouse } from '../data/types'
import { loadPreferences, savePreferences } from '../state/preferences'
import type { Preferences } from '../state/preferences'
import './settings.css'

const WAREHOUSE_OPTIONS: SelectOption<Warehouse>[] = WAREHOUSES.map((warehouse) => ({
  value: warehouse,
  label: WAREHOUSE_LABELS[warehouse],
}))

type SaveResult = { kind: 'saved' | 'failed'; text: string } | null

export default function SettingsPage() {
  const [draft, setDraft] = useState(loadPreferences)
  const [result, setResult] = useState<SaveResult>(null)

  const update = (patch: Partial<Preferences>) => setDraft((current) => ({ ...current, ...patch }))

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      savePreferences(draft)
      setResult({ kind: 'saved', text: 'Settings saved.' })
    } catch {
      setResult({ kind: 'failed', text: 'Your settings couldn’t be saved in this browser. Try again.' })
    }
  }

  return (
    <>
      <title>Settings · Wrenmoor Orders</title>
      <PageHeader title="Settings" description="Your notifications and the defaults new orders start with." />
      <form className="settings-form" onSubmit={save}>
        <Card title="Notifications">
          <fieldset className="settings-fieldset">
            <legend className="visually-hidden">Email notifications</legend>
            <Checkbox
              label="An order is placed"
              description="For orders from every channel."
              checked={draft.notifyPlaced}
              onChange={(event) => update({ notifyPlaced: event.target.checked })}
            />
            <Checkbox
              label="An order ships"
              description="Sent once the carrier scans the shipment."
              checked={draft.notifyShipped}
              onChange={(event) => update({ notifyShipped: event.target.checked })}
            />
            <Checkbox
              label="Daily summary"
              description="Yesterday's orders and anything that needs attention, at 8 AM."
              checked={draft.dailySummary}
              onChange={(event) => update({ dailySummary: event.target.checked })}
            />
          </fieldset>
        </Card>

        <Card title="Defaults">
          <Select
            label="Default warehouse"
            value={draft.defaultWarehouse}
            options={WAREHOUSE_OPTIONS}
            onChange={(defaultWarehouse) => update({ defaultWarehouse })}
            className="settings-select"
          />
        </Card>

        <div className="settings-actions">
          <Button type="submit" variant="primary">
            Save changes
          </Button>
          <p
            className={result?.kind === 'failed' ? 'status-message status-message--error' : 'status-message'}
            role="status"
          >
            {result?.text}
          </p>
        </div>
      </form>
    </>
  )
}
