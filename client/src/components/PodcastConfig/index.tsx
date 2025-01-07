import React from 'react';
import SelectField from './SelectField';
import { hosts, guests } from '../../config/podcastConfig';
import type { Host, Guest } from '../../config/podcastConfig';

type PodcastConfigProps = {
  host: Host | '';
  guest: Guest | '';
  setHost: (host: Host | '') => void;
  setGuest: (guest: Guest | '') => void;
};

export default function PodcastConfig({
  host,
  guest,
  setHost,
  setGuest
}: PodcastConfigProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-[#192734] p-6 rounded-lg mb-8">
      <h2 className="text-[#ffffff] text-xl font-semibold mb-6">Podcast Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SelectField
          label="Host"
          options={hosts}
          value={host}
          onChange={setHost}
        />
        <SelectField
          label="Guest"
          options={guests}
          value={guest}
          onChange={setGuest}
        />
      </div>
    </div>
  );
}