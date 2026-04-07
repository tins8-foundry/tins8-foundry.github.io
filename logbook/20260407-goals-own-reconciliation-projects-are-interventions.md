---
title: The Data Model For Automatable Agents, Planning, And Work Execution
date: April 7, 2026
description: A formal data model for The Founders Control Plane where goals are durable, reconciliation creates check-ins, agent mitigation plans surface as projects and tasks, and execution runs inside traceable sandboxes.
tags: Architecture, Data Model, Agents, Reconciliation, Sandboxing
---

# The Data Model For Automatable Agents, Planning, And Work Execution

The control-plane model gets cleaner if the long-lived operational object is the goal rather than the project. A project is often useful, but it is not the primary owner of truth. The goal is the durable intent, the place where targets live, and the place where recurring reconciliation happens over time.

That shift matters because projects come and go. One mitigation effort can close, another can open later, and some reconciliations need no project at all. If reconciliation history is attached to projects, the story fragments across temporary containers. If reconciliation history is attached to the goal, one continuous operational record is preserved of how that goal was evaluated and steered over time.

This is the right direction because the object model should stay familiar: goals, projects, tasks, updates, and visibility into progress are already a strong way to understand company work. The difference is that the participating actors here are not assumed to be only humans. Many of them are software systems, reconcilers, and bounded AI workers acting under explicit policy and authority.

That foundation is not only conceptual. The current implementation already models goals as durable intent, supports recurring check-ins, and reflects achievement and mitigation work through linked projects and tasks. AI and agents now make it possible to extend that foundation by helping create work, keeping the operational record current, and continuously reconciling goals against live signals. What is still being expanded is the deeper reconciliation, agent execution, and governance layer around that base.

## The Design Stance

The core stance is simple:

1. Goals own durable intent and reconciliation history.
2. Check-ins are the formal record of each reconciliation loop.
3. Projects are bounded mitigation or improvement efforts opened in response to reconciliation.
4. Tasks make the planned work legible and executable.
5. Agents execute tasks inside sandboxes, not through broad standing authority.

A goal is durable intent. It owns targets. It receives recurring check-ins. It remains the stable reference point even when the operating environment changes.

A project is an optional bounded mitigation or improvement effort in support of the goal. It can be opened, progressed, and closed. It is linked from the goal, but it is not the main place where reconciliation history lives.

This matters because agent planning should not stay hidden inside a conversation or internal chain of thought. If an agent determines that mitigation is needed, the plan should surface in the product as a project with tasks. That makes the intervention visible, reviewable, assignable, and traceable.

That gives a cleaner control loop:

1. Reconcile the goal
2. Evaluate its targets
3. Record the reconciliation as a goal check-in
4. Decide whether action is needed
5. Optionally create or update a project
6. Materialize mitigation as tasks
7. Execute tasks through humans or agents inside policy
8. Feed outcomes and evidence back into the next check-in

This is the important semantic rule: projects are interventions created in response to what goal reconciliation finds, and tasks are the executable units that carry the intervention into the world.

## Staying Familiar

The object model should stay familiar. Goals, projects, tasks, and updates are already a strong way to understand operational work. We should keep that shape. The control-plane difference is that the model becomes more formal about desired state, observed state, recurring reconciliation, sandboxed execution, and evidence.

Some users are founders or operators. Some users are reconcilers, software systems, or bounded AI workers. The platform should model all of them explicitly rather than pretending everything is a human status update.

## Core Objects

At this stage, the important thing is the role of each object rather than its final field list.

## Goal

The goal is the durable operational object. It is the owner of truth for the intent being managed.

## Target

Targets define how the goal is evaluated. They are the contract the reconciler keeps testing against observed reality.

## GoalCheckIn

A goal check-in is the periodic reconciliation snapshot of overall state against targets. Every agent reconciliation loop should create one. It records what was observed, how the targets evaluated, what decision followed, and which mitigation efforts, if any, were involved.

## Project

A project is a bounded intervention created in response to what reconciliation found. It is not the owner of the goal history. It is the container for the mitigation effort itself.

## ProjectUpdate

A project update is the regular status record for active work. It can be written on a schedule or after meaningful task changes. Unlike a goal check-in, it reports the state of the intervention itself rather than the overall evaluation of the goal.

## Task

Tasks are where planned work becomes legible. If an agent proposes mitigation, that plan should be reflected as project tasks rather than remaining implicit. This is the bridge between planning and execution.

## AgentExecutionRun

An agent execution run is the formal record of bounded action. The agent does not receive broad standing authority. It receives a sandbox for a specific task, with explicit limits, durable artifacts, and a result that can be reviewed.

## EvidenceRef

Evidence references make the model auditable. Check-ins, projects, tasks, approvals, and execution runs should all be able to point at the underlying artifacts that support them.

## Formalizing The Logbook

The logbook should become more formal around this distinction.

A goal check-in is the durable operational logbook. It is the authoritative history of how a goal was evaluated over time.

A project update is a progress report on a mitigation effort. It can also be produced regularly and automatically while work is active.

That means one goal check-in may reference:

- no project
- one active project
- multiple linked projects

The durable logbook belongs to the goal. Project updates and task runs are linked evidence inside that larger story. In practice, both goal check-ins and project updates can happen on regular automated schedules, but they answer different questions.

## Example: Cloud Cost Control

Consider a goal called Keep cloud spend under control with a target of monthly spend below 2K.

The goal check-ins can tell a continuous story:

1. Observed current spend at 2.8K
2. Identified deviation against target
3. Opened mitigation project Reduce cloud costs
4. Added tasks for rightsizing, idle resource cleanup, and storage tiering
5. Executed rightsizing task through an agent sandbox with cost tooling and limited credentials
6. Recorded artifacts and spend reduction evidence
7. Spend down to 2.2K
8. Opened follow-up task for storage tiering
9. Spend down to 1.9K
10. Target stable for three cycles

That story still makes sense if one project closes, another project opens later, or some cycles need no project at all. The goal remains the owner of truth throughout.

## Why This Fits The Product Direction

This keeps the center of gravity where it belongs: on enduring intent rather than temporary work containers.

It also aligns with the broader control-plane architecture:

- goals are continuously reconciled
- every reconciliation loop is recorded as a goal check-in
- projects are bounded interventions
- tasks are the visible form of agent planning
- agents execute tasks inside sandboxes
- evidence and provenance are attached to each meaningful change

That is the stronger product shape. It keeps a familiar goal-project-task shape, but adapts it for a world where many of the active users are agents rather than only humans. The result is a system that feels familiar at the object level while remaining much more formal about reconciliation, planning, authority, and durable operational memory.
