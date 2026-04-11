---
title: A Data Model For Goals, Work, And Agents
date: April 7, 2026
description: A simple model where goals hold the long-lived truth, reviews create check-ins, projects and tasks carry the current work, and agents run inside clear sandboxes.
tags: Architecture, Data Model, Agents, Reviews, Sandboxing
---

# A Data Model For Goals, Work, And Agents

Most teams already understand goals, projects, tasks, and updates.

The main question is not whether those objects are useful. The question is where the long-lived truth should live.

The model gets much cleaner when the goal is the long-lived object, not the project.

A project may matter a lot, but it is still only the current response to a goal.

The goal is the place that should hold the long story: what the company wants, how it will be judged, and how that goal has been reviewed over time.

## The Main Rule

Here is the simple rule behind the model:

1. goals hold the long-lived story
2. check-ins record each review
3. projects hold the current response
4. tasks make the work clear
5. agents do tasks inside bounded sandboxes

This matters because projects come and go.

One project may close. Another may open later. Some review cycles may need no project at all.

If the history lives on the project, the story gets split across temporary containers.

If the history lives on the goal, the company keeps one continuous record of how that goal was judged and steered over time.

## The Core Loop

The loop is simple:

1. review the goal
2. compare real signals to the target
3. write a goal check-in
4. decide whether action is needed
5. if needed, open or update a project
6. turn the plan into tasks
7. let people or agents do the tasks
8. feed the result into the next review

That keeps the goal at the center while still making the work concrete.

![Sketch of the data model showing Goal, GoalCheckIn, Project, Task, AgentExecutionRun, and supporting objects](graphics/data-model-sketch.svg "A sketch of the core data model: goals at the center, check-ins over time, projects and tasks as current work, and bounded agent runs with evidence.")

## What Each Object Does

## Goal

The goal is the main record.

It holds the goal itself, the reason behind it, the target, and the history of reviews.

## Target

The target says how the goal is judged.

It is the line the system checks against reality.

## GoalCheckIn

A goal check-in is the record of one review cycle.

It says what was observed, how the goal was judged, what decision followed, and whether follow-up work was opened.

## Project

A project is the current response to what the review found.

It is not the owner of the full history. It is the container for the work itself.

## ProjectUpdate

A project update reports the state of the current work.

That is different from a goal check-in, which reports the state of the goal.

## Task

Tasks make the plan visible and executable.

If an agent suggests a fix, that fix should show up as tasks in the product rather than staying hidden in a chat or internal reasoning.

## AgentExecutionRun

An agent run is the saved record of bounded action.

The agent does not get broad open-ended access. It gets a sandbox for one task, with clear limits, saved artifacts, and a result people can review.

## EvidenceRef

Evidence links the model back to real artifacts.

Check-ins, projects, tasks, approvals, and agent runs should all be able to point at the proof behind them.

## Why This Shape Helps

This model stays familiar.

It still uses goals, projects, tasks, and updates.

The difference is that it is stricter about where truth lives.

The goal owns the long-lived story.

The project owns the current response.

That makes change easier because the company can replace the work without losing the reason behind it.

## Example: Cloud Cost Control

Take a goal like Keep cloud spend under 2K per month.

The check-ins might tell a story like this:

1. spend is at 2.8K
2. the goal is off track
3. a cost-reduction project is opened
4. tasks are created for rightsizing, cleanup, and storage tiering
5. one task is run in an agent sandbox
6. evidence is saved
7. spend drops to 2.2K
8. a follow-up task is opened
9. spend drops to 1.9K
10. the goal stays stable for three cycles

That story still works if one project closes and another opens later.

The goal remains the main record the whole time.

## Example: Lead Growth

Take a goal like Increase qualified inbound leads to 120 per month.

The same model works cleanly:

1. current leads are 87
2. the goal has been off track for two review cycles
3. the system writes a goal check-in
4. the team reviews campaign results, landing-page conversion, and CRM handoff signals
5. a project is opened to recover lead quality and volume
6. tasks are created for the landing page, ad spend, and handoff flow
7. some tasks go to people and some are prepared with agent help
8. the next check-in records what changed and what happened

This example matters because it shows that the model is not only for engineering work.

It also works for commercial goals where the team needs one clear link between the goal, the review, the follow-up work, and the result.

## Why This Fits The Product

This keeps the center of gravity where it belongs: on the goal rather than the current work container.

It also fits the broader product direction:

- goals are reviewed again and again
- each review becomes a goal check-in
- projects hold the current response
- tasks make that response clear
- agents do tasks inside sandboxes
- evidence is attached to meaningful changes

That keeps the model familiar while making it strong enough for a world where both people and agents may carry the work.
