import React, { useEffect, useMemo, useState } from "react";

const SECTION_LABELS = {
  brand: "Brand",
  sections: "Sections",
  hero: "Hero",
  marquee: "Marquee",
  about: "About",
  focus: "Focus Areas",
  team: "Team",
  business: "Business",
  network: "Network",
  portfolio: "Portfolio",
  contact: "Contact",
  footer: "Footer",
};

const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none ${props.className ?? ""}`}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none ${props.className ?? ""}`}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none ${props.className ?? ""}`}
  />
);

const Field = ({ label, help, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
    {help && <span className="block text-xs text-slate-400">{help}</span>}
  </label>
);

const Card = ({ title, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">{title}</div>
    <div className="space-y-4 px-5 py-4">{children}</div>
  </section>
);

const SectionHeader = ({ title, description }) => (
  <div className="space-y-1">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    {description && <p className="text-xs text-slate-500">{description}</p>}
  </div>
);

const arrayFromText = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const textFromArray = (list) => (list ?? []).join("\n");

const tagsFromText = (text) =>
  text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const textFromTags = (tags) => (tags ?? []).join(", ");

const moveItem = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const cloneData = (value) =>
  typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const Editor = () => {
  const [content, setContent] = useState(null);
  const [active, setActive] = useState("brand");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const iconKeys = useMemo(() => content?.iconKeys ?? [], [content]);

  const updateAtPath = (path, value) => {
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateArrayItem = (path, index, updater) => {
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < path.length; i += 1) {
        cursor = cursor[path[i]];
      }
      cursor[index] = updater(cursor[index]);
      return next;
    });
  };

  const addArrayItem = (path, item) => {
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < path.length; i += 1) {
        cursor = cursor[path[i]];
      }
      cursor.push(item);
      return next;
    });
  };

  const removeArrayItem = (path, index) => {
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < path.length; i += 1) {
        cursor = cursor[path[i]];
      }
      cursor.splice(index, 1);
      return next;
    });
  };

  const moveArrayItem = (path, from, to) => {
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < path.length; i += 1) {
        cursor = cursor[path[i]];
      }
      cursor.splice(0, cursor.length, ...moveItem(cursor, from, to));
      return next;
    });
  };

  const loadContent = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/__editor/content");
      if (!res.ok) throw new Error("Failed to load content");
      const data = await res.json();
      setContent(data);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to load content");
    }
  };

  const saveContent = async () => {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/__editor/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content, null, 2),
      });
      if (!res.ok) throw new Error("Failed to save content");
      const data = await res.json();
      setStatus(`saved:${data.savedAt}`);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to save content");
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          {status === "error" ? error : "Loading editor..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold">DWD Content Editor</h1>
            <p className="text-xs text-slate-500">Edit content.data.json and regenerate content.jsx.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadContent}
              className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Reload
            </button>
            <button
              onClick={saveContent}
              className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
        {status.startsWith("saved") && (
          <div className="bg-emerald-50 px-6 py-2 text-xs text-emerald-700">
            Saved at {status.split(":")[1]}
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-50 px-6 py-2 text-xs text-red-700">{error}</div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[220px_1fr] gap-6 px-6 py-8">
        <aside className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          {Object.keys(SECTION_LABELS).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full rounded px-3 py-2 text-left text-sm font-medium ${
                active === key ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </aside>

        <main className="space-y-6">
          {active === "brand" && (
            <Card title="Brand">
              <SectionHeader title="Navigation Brand" description="Top-left brand mark." />
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Left">
                  <Input value={content.brand.left} onChange={(e) => updateAtPath(["brand", "left"], e.target.value)} />
                </Field>
                <Field label="Dot">
                  <Input value={content.brand.dot} onChange={(e) => updateAtPath(["brand", "dot"], e.target.value)} />
                </Field>
                <Field label="Right">
                  <Input value={content.brand.right} onChange={(e) => updateAtPath(["brand", "right"], e.target.value)} />
                </Field>
              </div>
            </Card>
          )}

          {active === "sections" && (
            <Card title="Sections">
              <SectionHeader title="Navigation & Section Headers" description="Order here defines navigation order." />
              <div className="space-y-4">
                {content.sections.map((section, index) => (
                  <div key={section.id} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">ID: {section.id}</div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <Field label="Nav Label">
                        <Input
                          value={section.navLabel}
                          onChange={(e) => updateAtPath(["sections", index, "navLabel"], e.target.value)}
                        />
                      </Field>
                      <Field label="Number">
                        <Input
                          value={section.number}
                          onChange={(e) => updateAtPath(["sections", index, "number"], e.target.value)}
                        />
                      </Field>
                      <Field label="Title">
                        <Input
                          value={section.title}
                          onChange={(e) => updateAtPath(["sections", index, "title"], e.target.value)}
                        />
                      </Field>
                      <Field label="Title Lines" help="One line per row (optional).">
                        <TextArea
                          rows={3}
                          value={textFromArray(section.titleLines ?? [])}
                          onChange={(e) => {
                            const lines = arrayFromText(e.target.value);
                            updateAtPath(["sections", index, "titleLines"], lines.length > 0 ? lines : null);
                          }}
                        />
                      </Field>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      Section order is fixed to match the page layout.
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {active === "hero" && (
            <Card title="Hero">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title Lines" help="One line per row.">
                  <TextArea
                    rows={4}
                    value={textFromArray(content.hero.titleLines)}
                    onChange={(e) => updateAtPath(["hero", "titleLines"], arrayFromText(e.target.value))}
                  />
                </Field>
                <Field label="Subtitle Lines" help="One line per row.">
                  <TextArea
                    rows={4}
                    value={textFromArray(content.hero.subtitleLines)}
                    onChange={(e) => updateAtPath(["hero", "subtitleLines"], arrayFromText(e.target.value))}
                  />
                </Field>
              </div>
              <SectionHeader title="Hero Card" />
              <Field label="Card Icon">
                <Select
                  value={content.hero.card.iconKey}
                  onChange={(e) => updateAtPath(["hero", "card", "iconKey"], e.target.value)}
                >
                  {iconKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="space-y-3">
                {content.hero.card.lines.map((line, index) => (
                  <div key={`${line.text}-${index}`} className="flex items-center gap-3">
                    <Input
                      value={line.text}
                      onChange={(e) =>
                        updateArrayItem(["hero", "card", "lines"], index, (item) => ({
                          ...item,
                          text: e.target.value,
                        }))
                      }
                    />
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={line.accent ?? false}
                        onChange={(e) =>
                          updateArrayItem(["hero", "card", "lines"], index, (item) => ({
                            ...item,
                            accent: e.target.checked,
                          }))
                        }
                      />
                      Accent
                    </label>
                    <button
                      className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                      onClick={() => removeArrayItem(["hero", "card", "lines"], index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => addArrayItem(["hero", "card", "lines"], { text: "NEW LINE" })}
                >
                  + Add Line
                </button>
              </div>
            </Card>
          )}

          {active === "marquee" && (
            <Card title="Marquee">
              <Field label="Primary Text">
                <Input value={content.marquee.primary} onChange={(e) => updateAtPath(["marquee", "primary"], e.target.value)} />
              </Field>
              <Field label="Secondary Text">
                <Input value={content.marquee.secondary} onChange={(e) => updateAtPath(["marquee", "secondary"], e.target.value)} />
              </Field>
            </Card>
          )}

          {active === "about" && (
            <Card title="About">
              <Field label="Headline">
                <Input value={content.about.headlineLine} onChange={(e) => updateAtPath(["about", "headlineLine"], e.target.value)} />
              </Field>
              <Field label="Headline Highlight">
                <Input
                  value={content.about.headlineHighlight}
                  onChange={(e) => updateAtPath(["about", "headlineHighlight"], e.target.value)}
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Mission Title">
                  <Input value={content.about.missionTitle} onChange={(e) => updateAtPath(["about", "missionTitle"], e.target.value)} />
                </Field>
                <Field label="Vision Title">
                  <Input value={content.about.visionTitle} onChange={(e) => updateAtPath(["about", "visionTitle"], e.target.value)} />
                </Field>
              </div>
              <Field label="Mission Text">
                <TextArea value={content.about.missionText} onChange={(e) => updateAtPath(["about", "missionText"], e.target.value)} />
              </Field>
              <Field label="Vision Text">
                <TextArea value={content.about.visionText} onChange={(e) => updateAtPath(["about", "visionText"], e.target.value)} />
              </Field>
            </Card>
          )}

          {active === "focus" && (
            <Card title="Focus Areas">
              <div className="space-y-4">
                {content.focus.areas.map((area, index) => (
                  <div key={area.id} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">ID: {area.id}</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <Input value={area.title} onChange={(e) => updateAtPath(["focus", "areas", index, "title"], e.target.value)} />
                      </Field>
                      <Field label="Korean Title">
                        <Input value={area.kor} onChange={(e) => updateAtPath(["focus", "areas", index, "kor"], e.target.value)} />
                      </Field>
                      <Field label="Code">
                        <Input value={area.code} onChange={(e) => updateAtPath(["focus", "areas", index, "code"], e.target.value)} />
                      </Field>
                      <Field label="Icon">
                        <Select
                          value={area.iconKey}
                          onChange={(e) => updateAtPath(["focus", "areas", index, "iconKey"], e.target.value)}
                        >
                          {iconKeys.map((key) => (
                            <option key={key} value={key}>
                              {key}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>
                    <Field label="Description">
                      <TextArea value={area.desc} onChange={(e) => updateAtPath(["focus", "areas", index, "desc"], e.target.value)} />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["focus", "areas"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["focus", "areas"], index, Math.min(content.focus.areas.length - 1, index + 1))}
                        disabled={index === content.focus.areas.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["focus", "areas"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(
                      0,
                      ...content.focus.areas.map((area) => Number(area.id.replace("F", "")) || 0)
                    );
                    addArrayItem(["focus", "areas"], {
                      id: `F${String(maxId + 1).padStart(2, "0")}`,
                      title: "New Area",
                      kor: "",
                      desc: "",
                      code: "",
                      iconKey: iconKeys[0] ?? "Dna",
                    });
                  }}
                >
                  + Add Focus Area
                </button>
              </div>
            </Card>
          )}

          {active === "team" && (
            <Card title="Team">
              <div className="space-y-4">
                {content.team.members.map((member, index) => (
                  <div key={member.id} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">ID: {member.id}</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Name">
                        <Input value={member.name} onChange={(e) => updateAtPath(["team", "members", index, "name"], e.target.value)} />
                      </Field>
                      <Field label="Role">
                        <Input value={member.role} onChange={(e) => updateAtPath(["team", "members", index, "role"], e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Bio">
                      <TextArea value={member.bio} onChange={(e) => updateAtPath(["team", "members", index, "bio"], e.target.value)} />
                    </Field>
                    <Field label="Tags (comma separated)">
                      <Input
                        value={textFromTags(member.tags)}
                        onChange={(e) => updateAtPath(["team", "members", index, "tags"], tagsFromText(e.target.value))}
                      />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["team", "members"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["team", "members"], index, Math.min(content.team.members.length - 1, index + 1))}
                        disabled={index === content.team.members.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["team", "members"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(0, ...content.team.members.map((member) => Number(member.id) || 0));
                    addArrayItem(["team", "members"], {
                      id: maxId + 1,
                      name: "New Member",
                      role: "",
                      bio: "",
                      tags: [],
                    });
                  }}
                >
                  + Add Team Member
                </button>
              </div>
            </Card>
          )}

          {active === "business" && (
            <Card title="Business">
              <div className="space-y-4">
                {content.business.steps.map((step, index) => (
                  <div key={step.id} className="rounded border border-slate-200 p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Step ID">
                        <Input value={step.id} onChange={(e) => updateAtPath(["business", "steps", index, "id"], e.target.value)} />
                      </Field>
                      <Field label="Title">
                        <Input value={step.title} onChange={(e) => updateAtPath(["business", "steps", index, "title"], e.target.value)} />
                      </Field>
                      <Field label="Icon">
                        <Select
                          value={step.iconKey}
                          onChange={(e) => updateAtPath(["business", "steps", index, "iconKey"], e.target.value)}
                        >
                          {iconKeys.map((key) => (
                            <option key={key} value={key}>
                              {key}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>
                    <Field label="Description">
                      <TextArea value={step.desc} onChange={(e) => updateAtPath(["business", "steps", index, "desc"], e.target.value)} />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["business", "steps"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() =>
                          moveArrayItem(["business", "steps"], index, Math.min(content.business.steps.length - 1, index + 1))
                        }
                        disabled={index === content.business.steps.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["business", "steps"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(0, ...content.business.steps.map((step) => Number(step.id) || 0));
                    addArrayItem(["business", "steps"], {
                      id: String(maxId + 1).padStart(2, "0"),
                      title: "New Step",
                      desc: "",
                      iconKey: iconKeys[0] ?? "Dna",
                    });
                  }}
                >
                  + Add Business Step
                </button>
              </div>
            </Card>
          )}

          {active === "network" && (
            <Card title="Network">
              <Field label="Status Label">
                <Input value={content.network.statusLabel} onChange={(e) => updateAtPath(["network", "statusLabel"], e.target.value)} />
              </Field>
              <Field label="Status Lines" help="One line per row. {count} will be replaced automatically.">
                <TextArea
                  rows={3}
                  value={textFromArray(content.network.statusLines)}
                  onChange={(e) => updateAtPath(["network", "statusLines"], arrayFromText(e.target.value))}
                />
              </Field>
              <SectionHeader title="Nodes" description="x/y are percentages between 0 and 100." />
              <div className="space-y-4">
                {content.network.nodes.map((node, index) => (
                  <div key={`${node.city}-${index}`} className="grid gap-4 rounded border border-slate-200 p-4 md:grid-cols-3">
                    <Field label="City">
                      <Input value={node.city} onChange={(e) => updateAtPath(["network", "nodes", index, "city"], e.target.value)} />
                    </Field>
                    <Field label="X">
                      <Input
                        type="number"
                        value={node.x}
                        onChange={(e) => updateAtPath(["network", "nodes", index, "x"], Number(e.target.value))}
                      />
                    </Field>
                    <Field label="Y">
                      <Input
                        type="number"
                        value={node.y}
                        onChange={(e) => updateAtPath(["network", "nodes", index, "y"], Number(e.target.value))}
                      />
                    </Field>
                    <div className="md:col-span-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["network", "nodes"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["network", "nodes"], index, Math.min(content.network.nodes.length - 1, index + 1))}
                        disabled={index === content.network.nodes.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["network", "nodes"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => addArrayItem(["network", "nodes"], { city: "New City", x: 50, y: 50 })}
                >
                  + Add Node
                </button>
              </div>
            </Card>
          )}

          {active === "portfolio" && (
            <Card title="Portfolio">
              <Field label="Table Headers">
                <div className="grid gap-4 md:grid-cols-5">
                  {Object.entries(content.portfolio.tableHeaders).map(([key, value]) => (
                    <Input
                      key={key}
                      value={value}
                      onChange={(e) => updateAtPath(["portfolio", "tableHeaders", key], e.target.value)}
                    />
                  ))}
                </div>
              </Field>
              <Field label="Investment Label">
                <Input
                  value={content.portfolio.investmentLabel}
                  onChange={(e) => updateAtPath(["portfolio", "investmentLabel"], e.target.value)}
                />
              </Field>
              <Field label="Milestones Label">
                <Input
                  value={content.portfolio.milestonesLabel}
                  onChange={(e) => updateAtPath(["portfolio", "milestonesLabel"], e.target.value)}
                />
              </Field>
              <Field label="Visit Button Label">
                <Input value={content.portfolio.visitLabel} onChange={(e) => updateAtPath(["portfolio", "visitLabel"], e.target.value)} />
              </Field>
              <SectionHeader title="Items" description="List order controls display order." />
              <div className="space-y-4">
                {content.portfolio.items.map((item, index) => (
                  <div key={item.id} className="rounded border border-slate-200 p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="ID">
                        <Input value={item.id} onChange={(e) => updateAtPath(["portfolio", "items", index, "id"], Number(e.target.value))} />
                      </Field>
                      <Field label="Name">
                        <Input value={item.name} onChange={(e) => updateAtPath(["portfolio", "items", index, "name"], e.target.value)} />
                      </Field>
                      <Field label="Category">
                        <Input
                          value={item.category}
                          onChange={(e) => updateAtPath(["portfolio", "items", index, "category"], e.target.value)}
                        />
                      </Field>
                      <Field label="Year">
                        <Input value={item.year} onChange={(e) => updateAtPath(["portfolio", "items", index, "year"], e.target.value)} />
                      </Field>
                      <Field label="Image URL">
                        <Input value={item.image} onChange={(e) => updateAtPath(["portfolio", "items", index, "image"], e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Description">
                      <TextArea
                        value={item.description}
                        onChange={(e) => updateAtPath(["portfolio", "items", index, "description"], e.target.value)}
                      />
                    </Field>
                    <Field label="Highlights (one per line)">
                      <TextArea
                        rows={4}
                        value={textFromArray(item.highlights)}
                        onChange={(e) => updateAtPath(["portfolio", "items", index, "highlights"], arrayFromText(e.target.value))}
                      />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["portfolio", "items"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["portfolio", "items"], index, Math.min(content.portfolio.items.length - 1, index + 1))}
                        disabled={index === content.portfolio.items.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["portfolio", "items"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(0, ...content.portfolio.items.map((item) => Number(item.id) || 0));
                    addArrayItem(["portfolio", "items"], {
                      id: maxId + 1,
                      name: "New Company",
                      category: "",
                      year: "",
                      image: "",
                      description: "",
                      highlights: [],
                    });
                  }}
                >
                  + Add Portfolio Item
                </button>
              </div>
            </Card>
          )}

          {active === "contact" && (
            <Card title="Contact">
              <Field label="Pretitle">
                <Input value={content.contact.pretitle} onChange={(e) => updateAtPath(["contact", "pretitle"], e.target.value)} />
              </Field>
              <Field label="Title Lines" help="One line per row.">
                <TextArea
                  rows={3}
                  value={textFromArray(content.contact.titleLines)}
                  onChange={(e) => updateAtPath(["contact", "titleLines"], arrayFromText(e.target.value))}
                />
              </Field>
              <SectionHeader title="Form" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name Placeholder">
                  <Input
                    value={content.contact.form.namePlaceholder}
                    onChange={(e) => updateAtPath(["contact", "form", "namePlaceholder"], e.target.value)}
                  />
                </Field>
                <Field label="Email Placeholder">
                  <Input
                    value={content.contact.form.emailPlaceholder}
                    onChange={(e) => updateAtPath(["contact", "form", "emailPlaceholder"], e.target.value)}
                  />
                </Field>
                <Field label="Message Placeholder">
                  <Input
                    value={content.contact.form.messagePlaceholder}
                    onChange={(e) => updateAtPath(["contact", "form", "messagePlaceholder"], e.target.value)}
                  />
                </Field>
                <Field label="Submit Label">
                  <Input
                    value={content.contact.form.submitLabel}
                    onChange={(e) => updateAtPath(["contact", "form", "submitLabel"], e.target.value)}
                  />
                </Field>
              </div>
              <SectionHeader title="Address" />
              <Field label="Headquarters Label">
                <Input
                  value={content.contact.headquartersLabel}
                  onChange={(e) => updateAtPath(["contact", "headquartersLabel"], e.target.value)}
                />
              </Field>
              <Field label="Address Lines (one per line)">
                <TextArea
                  rows={2}
                  value={textFromArray(content.contact.headquartersAddressLines)}
                  onChange={(e) => updateAtPath(["contact", "headquartersAddressLines"], arrayFromText(e.target.value))}
                />
              </Field>
              <Field label="Map Link Label">
                <Input value={content.contact.mapLinkLabel} onChange={(e) => updateAtPath(["contact", "mapLinkLabel"], e.target.value)} />
              </Field>
              <Field label="Contact Label">
                <Input value={content.contact.contactLabel} onChange={(e) => updateAtPath(["contact", "contactLabel"], e.target.value)} />
              </Field>
              <Field label="Contact Email">
                <Input value={content.contact.email} onChange={(e) => updateAtPath(["contact", "email"], e.target.value)} />
              </Field>
            </Card>
          )}

          {active === "footer" && (
            <Card title="Footer">
              <Field label="Copyright">
                <Input value={content.footer.copyright} onChange={(e) => updateAtPath(["footer", "copyright"], e.target.value)} />
              </Field>
              <SectionHeader title="Links" />
              <div className="space-y-4">
                {content.footer.links.map((link, index) => (
                  <div key={`${link.label}-${index}`} className="grid gap-4 rounded border border-slate-200 p-4 md:grid-cols-2">
                    <Field label="Label">
                      <Input value={link.label} onChange={(e) => updateAtPath(["footer", "links", index, "label"], e.target.value)} />
                    </Field>
                    <Field label="URL">
                      <Input value={link.href} onChange={(e) => updateAtPath(["footer", "links", index, "href"], e.target.value)} />
                    </Field>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["footer", "links"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["footer", "links"], index, Math.min(content.footer.links.length - 1, index + 1))}
                        disabled={index === content.footer.links.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["footer", "links"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => addArrayItem(["footer", "links"], { label: "New Link", href: "#" })}
                >
                  + Add Footer Link
                </button>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Editor;
