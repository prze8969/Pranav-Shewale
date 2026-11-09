import React from 'react';
import { HeroDovahkiin } from '../components/HeroDovahkiin';
import { QuestJournal } from '../components/QuestJournal';
import { InventoryGrid } from '../components/InventoryGrid';
import { PerkTree } from '../components/PerkTree';
import { CharacterSheet } from '../components/CharacterSheet';
import { CourierContact } from '../components/CourierContact';

export default function Home() {
  return (
    <div className="space-y-12">
      <HeroDovahkiin />
      <QuestJournal />
      <InventoryGrid />
      <PerkTree />
      <CharacterSheet />
      <CourierContact />
    </div>
  );
}
