import SwiftUI
import ScenicKit

/// 08 Scenic Pass: the island, the promise, four benefits, two plans.
/// Not on sale yet: the button says so plainly instead of pretending to charge.
struct ScenicPassView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var yearly = true
    @State private var notYet = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                IslandView(region: .dolomites, fit: 1.0, lift: -0.02, interactive: false)
                    .frame(height: 320).frame(maxWidth: .infinity)
                    .background(LinearGradient(colors: [Theme.sky, Theme.background], startPoint: .top, endPoint: .bottom).padding(.top, -200))
                VStack(alignment: .leading, spacing: 0) {
                    Text("SCENIC PASS").font(Theme.labelFont).tracking(1).foregroundStyle(Theme.green)
                    Text("Plan the whole journey, not just the day")
                        .font(Theme.sofia(30, .semibold, relativeTo: .title)).tracking(-0.6).foregroundStyle(Theme.ink)
                        .padding(.top, 8).fixedSize(horizontal: false, vertical: true)
                    VStack(alignment: .leading, spacing: 16) {
                        benefit("Multi-day journeys", "Day stages with campsites and overnight stops")
                        benefit("Caravan and campervan profiles", "Length, width and gradient limits on every route")
                        benefit("Offline maps", "Alps, Norway and the Scottish Highlands, without signal")
                        benefit("Unlimited logbook and GPX", "Every stamp, every route, yours to export")
                    }
                    .padding(.top, 24)
                    HStack(spacing: 10) {
                        plan(on: yearly, title: "Yearly", price: "€34.99", note: "€2.92 a month", badge: "Save 50%") { yearly = true }
                        plan(on: !yearly, title: "Monthly", price: "€5.99", note: "cancel any time", badge: nil) { yearly = false }
                    }
                    .padding(.top, 28)
                    Button { notYet = true } label: {
                        Text("Try 14 days free").font(Theme.buttonFont).foregroundStyle(Theme.onAccent)
                            .frame(maxWidth: .infinity, minHeight: 56)
                            .background(Theme.green, in: RoundedRectangle(cornerRadius: 16))
                    }
                    .buttonStyle(.plain)
                    .padding(.top, 28)
                    Text("Prices include VAT. Restore purchases · Terms")
                        .font(Theme.sofia(12)).foregroundStyle(Theme.ink3)
                        .frame(maxWidth: .infinity).padding(.top, 12)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 30)
            }
        }
        .ignoresSafeArea(edges: .top)
        .background(Theme.background)
        .overlay(alignment: .topTrailing) {
            Button { dismiss() } label: {
                Image(systemName: "xmark").font(.system(size: 14, weight: .semibold)).foregroundStyle(Theme.ink)
                    .frame(width: 36, height: 36).background(Theme.surface, in: Circle())
                    .shadow(color: Theme.ink.opacity(0.1), radius: 6, y: 2)
            }
            .padding(16)
            .accessibilityLabel("Close")
        }
        .alert("Not on sale yet", isPresented: $notYet) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Everything in Panoramica is free while we test it.")
        }
    }

    private func benefit(_ title: String, _ detail: String) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 14) {
            Image(systemName: "checkmark").font(.system(size: 14, weight: .semibold)).foregroundStyle(Theme.green)
            VStack(alignment: .leading, spacing: 3) {
                Text(title).font(Theme.sofia(16, .medium)).foregroundStyle(Theme.ink)
                Text(detail).font(Theme.sofia(13)).foregroundStyle(Theme.ink2)
            }
        }
    }

    private func plan(on: Bool, title: String, price: String, note: String, badge: String?, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 3) {
                Text(title).font(Theme.sofia(13, .medium)).foregroundStyle(Theme.ink2)
                Text(price).font(Theme.sofia(24, .semibold)).foregroundStyle(Theme.ink).monospacedDigit()
                Text(note).font(Theme.sofia(12)).foregroundStyle(Theme.ink2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .background(on ? Theme.greenTint : Theme.surface, in: RoundedRectangle(cornerRadius: 16))
            .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(on ? Theme.green : Theme.border, lineWidth: on ? 1.5 : 1))
            .overlay(alignment: .top) {
                if let badge {
                    Text(badge).font(Theme.sofia(12, .semibold)).foregroundStyle(.white)
                        .padding(.horizontal, 10).frame(height: 22).background(Theme.green, in: Capsule())
                        .offset(y: -11)
                }
            }
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(on ? .isSelected : [])
    }
}
